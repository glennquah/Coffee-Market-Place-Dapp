import Hero from '../components/MainHero';
import ResponsiveContainer from '../components/ResponsiveContainer';
import { HeroVariant } from '../types/types';

function CartPage() {
  return (
    <div className="py-8">
      <ResponsiveContainer>
        <Hero
          variant={HeroVariant.V1}
          title={'Shopping Cart'}
          subTitle={'Review your items and proceed to checkout.'}
        />
      </ResponsiveContainer>
    </div>
  );
}

export default CartPage;
