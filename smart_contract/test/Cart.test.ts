import { expect } from 'chai';
import { Signer } from 'ethers';
import { Cart, CoffeeMarketplace, Order, Product } from '../typechain-types';
import { deployContracts } from './test_setup/deployContract';

describe('Cart', function () {
  let cart: Cart;
  let customer: Signer;

  beforeEach(async function () {
    const contracts = await deployContracts();
    customer = contracts.customer1;
    cart = contracts.cart;
  });

  describe('addToCart', function () {
    it('Should allow when customer adds a product to cart', async function () {
      const productId = 1;
      const quantity = 1;

      // Check if the product was added successfully
      await expect(
        cart.connect(customer).addToCart(productId, quantity),
      ).to.emit(cart, 'ProductAddedToCart');

      const customerCart = await cart.connect(customer).viewCart();
      expect(customerCart.length).to.equal(1);
      expect(customerCart[0].productId).to.equal(productId);
      expect(customerCart[0].quantity).to.equal(1);
    });

    it('Should revert when customer adds non-existent product to cart', async function () {
      const productId = 0;
      const quantity = 1;

      await expect(
        cart.connect(customer).addToCart(productId, quantity),
      ).to.be.revertedWith('Product does not exist.');

      const customerCart = await cart.connect(customer).viewCart();
      expect(customerCart.length).to.equal(0);
    });

    it('Should revert when customer adds more quantity than available', async function () {
      const productId = 1;
      const quantity = 11;

      await expect(
        cart.connect(customer).addToCart(productId, quantity),
      ).to.be.revertedWith('Not enough stock available.');
    });

    it('Should allow when customer updates quantity if product already in cart', async function () {
      const productIds = [1, 1];
      const quantities = [2, 3];

      for (let i = 0; i < productIds.length; i++) {
        await cart.connect(customer).addToCart(productIds[i], quantities[i]);
      }

      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(1);
      expect(userCart[0].quantity).to.equal(5);
    });

    it('Should allow when customer adds multiple products to cart', async function () {
      const productIds = [1, 2];
      const quantities = [1, 5];

      for (let i = 0; i < productIds.length; i++) {
        await expect(
          cart.connect(customer).addToCart(productIds[i], quantities[i]),
        ).to.emit(cart, 'ProductAddedToCart');
      }

      const customerCart = await cart.connect(customer).viewCart();
      expect(customerCart.length).to.equal(2);

      // productId #1
      expect(customerCart[0].productId).to.equal(1);
      expect(customerCart[0].quantity).to.equal(1);

      // productId #2
      expect(customerCart[1].productId).to.equal(2);
      expect(customerCart[1].quantity).to.equal(5);
    });
  });

  describe('viewCart', function () {
    it('Should allow when new customer wants to view empty cart', async function () {
      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(0);
    });

    it('Should allow when customer wants to view correct cart contents', async function () {
      const productId = 1;
      const quantity = 2;

      await cart.connect(customer).addToCart(productId, quantity);
      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(1);
      expect(userCart[0].productId).to.equal(1);
      expect(userCart[0].quantity).to.equal(2);
    });
  });

  describe('updateCart', function () {
    const productId = 1;
    const quantity = 2;

    beforeEach(async function () {
      await cart.connect(customer).addToCart(productId, quantity);
    });

    it('Should allow when customer wants to update quantity of existing Product', async function () {
      const newQuantity = 3;
      await expect(
        cart.connect(customer).updateCart(productId, newQuantity),
      ).to.emit(cart, 'ProductUpdatedInCart');

      const customerCart = await cart.connect(customer).viewCart();
      expect(customerCart[0].quantity).to.equal(3);
    });

    it('Should allow when customer wants to remove Product when quantity set to 0', async function () {
      const newQuantity = 0;
      await expect(
        cart.connect(customer).updateCart(productId, newQuantity),
      ).to.emit(cart, 'ProductRemovedFromCart');

      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(0);
    });

    it('Should revert when customer wants to update non-existent product', async function () {
      const unknownProductId = 2;
      const newQuantity = 1;
      await expect(
        cart.connect(customer).updateCart(unknownProductId, newQuantity),
      ).to.be.revertedWith('Product not found in cart.');
    });

    it('Should revert when customer wants to update more than available quantity', async function () {
      const newQuantity = 11;
      await expect(
        cart.connect(customer).updateCart(productId, newQuantity),
      ).to.be.revertedWith('Not enough stock available.');
    });
  });

  describe('removeFromCart', function () {
    const productId = 1;
    const quantity = 2;

    beforeEach(async function () {
      await cart.connect(customer).addToCart(productId, quantity);
    });

    it('Should allow when customer wants to remove product from cart', async function () {
      await expect(cart.connect(customer).removeFromCart(productId)).to.emit(
        cart,
        'ProductRemovedFromCart',
      );

      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(0);
    });

    it('Should revert when customer wants to remove non-existent product', async function () {
      const newProductId = 2;
      await expect(
        cart.connect(customer).removeFromCart(newProductId),
      ).to.be.revertedWith('Product not found in cart.');
    });

    it('Should allow when customer wants to remove all products from cart', async function () {
      await expect(cart.connect(customer).removeAllProductsFromCart()).to.emit(
        cart,
        'CartCleared',
      );

      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(0);
    });
  });

  describe('checkout', function () {
    const productIds = [1, 2];
    const quantities = [2, 3];

    beforeEach(async function () {
      for (let i = 0; i < productIds.length; i++) {
        await cart.connect(customer).addToCart(productIds[i], quantities[i]);
      }
    });

    it('Should emit event and create an order on checkout', async function () {
      // Emit CartCheckout event
      await expect(cart.connect(customer).checkout())
        .to.emit(cart, 'CartCheckout')
        .withArgs(await customer.getAddress(), 5); // Order ID should be 5, as 4 orders were created before
    });

    it('Should allow when customer wants to clear all products from the cart after checkout', async function () {
      await expect(cart.connect(customer).checkout()).to.emit(
        cart,
        'CartCleared',
      );

      const userCart = await cart.connect(customer).viewCart();
      expect(userCart.length).to.equal(0);
    });
  });
});

describe('Cart with Multiple Customers', function () {
  let coffeeMarketplace: CoffeeMarketplace;
  let cart: Cart;
  let product: Product;
  let roaster: Signer;
  let order: Order;
  let customer1: Signer;
  let customer2: Signer;

  beforeEach(async function () {
    const contracts = await deployContracts();
    coffeeMarketplace = contracts.coffeeMarketplace;
    product = contracts.product;
    order = contracts.order;
    cart = contracts.cart;
  });
});

describe('Multiple Customers with Different Carts', function () {
  let coffeeMarketplace: CoffeeMarketplace;
  let cart: Cart;
  let product: Product;
  let roaster: Signer;
  let order: Order;
  let customer1: Signer;
  let customer2: Signer;

  beforeEach(async function () {
    const contracts = await deployContracts();
    coffeeMarketplace = contracts.coffeeMarketplace;
    product = contracts.product;
    order = contracts.order;
    cart = contracts.cart;
    customer1 = contracts.customer1;
    customer2 = contracts.customer2;
  });

  const firstProductId = 1;
  const secondProductId = 2;
  const thirdProductId = 3;
  const fourthProductId = 4;

  const singleQuantity = 1;
  const doubleQuantity = 2;
  const tripleQuantity = 3;

  it('Should allow when different customers have separate carts', async function () {
    await cart.connect(customer1).addToCart(firstProductId, doubleQuantity);
    await cart.connect(customer1).addToCart(secondProductId, singleQuantity);

    await cart.connect(customer2).addToCart(thirdProductId, tripleQuantity);
    await cart.connect(customer2).addToCart(fourthProductId, doubleQuantity);

    const customer1Cart = await cart.connect(customer1).viewCart();
    expect(customer1Cart.length).to.equal(2);
    expect(customer1Cart[0].productId).to.equal(1);
    expect(customer1Cart[0].quantity).to.equal(2);
    expect(customer1Cart[1].productId).to.equal(2);
    expect(customer1Cart[1].quantity).to.equal(1);

    const customer2Cart = await cart.connect(customer2).viewCart();
    expect(customer2Cart.length).to.equal(2);
    expect(customer2Cart[0].productId).to.equal(3);
    expect(customer2Cart[0].quantity).to.equal(3);
    expect(customer2Cart[1].productId).to.equal(4);
    expect(customer2Cart[1].quantity).to.equal(2);
  });

  it('Should allow when customers update their carts independently', async function () {
    await cart.connect(customer1).addToCart(firstProductId, singleQuantity);
    await cart.connect(customer2).addToCart(firstProductId, singleQuantity);

    await cart.connect(customer1).updateCart(firstProductId, tripleQuantity);

    const customer1Cart = await cart.connect(customer1).viewCart();
    expect(customer1Cart[0].quantity).to.equal(3);

    const customer2Cart = await cart.connect(customer2).viewCart();
    expect(customer2Cart[0].quantity).to.equal(1);
  });

  it('Should allow when customers remove products from their carts independently', async function () {
    await cart.connect(customer1).addToCart(firstProductId, singleQuantity);
    await cart.connect(customer1).addToCart(secondProductId, singleQuantity);

    await cart.connect(customer2).addToCart(firstProductId, singleQuantity);
    await cart.connect(customer2).addToCart(secondProductId, singleQuantity);

    await cart.connect(customer1).removeFromCart(1);

    const customer1Cart = await cart.connect(customer1).viewCart();
    expect(customer1Cart.length).to.equal(1);
    expect(customer1Cart[0].productId).to.equal(2);

    const customer2Cart = await cart.connect(customer2).viewCart();
    expect(customer2Cart.length).to.equal(2);
  });

  it('Should allow when customers checkout independently', async function () {
    await cart.connect(customer1).addToCart(firstProductId, singleQuantity);
    await cart.connect(customer2).addToCart(secondProductId, singleQuantity);

    await cart.connect(customer1).checkout();

    const customer1Cart = await cart.connect(customer1).viewCart();
    expect(customer1Cart.length).to.equal(0);

    const customer2Cart = await cart.connect(customer2).viewCart();
    expect(customer2Cart.length).to.equal(1);
    expect(customer2Cart[0].productId).to.equal(2);
  });
});
