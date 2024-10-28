import { CoffeeCardProps } from '../types/types';

const handleVote = () => {
  alert('Vote button clicked!');
};

const handleBid = () => {
  alert('Bid button clicked!');
};

const handleListing = () => {
  alert('Listing clicked!');
};

const mockCoffeeData: CoffeeCardProps[] = [
  {
    type: 'listing',
    imageUrl:'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIVFRIVFxcVFRYYGBUVFxcVFxUXFhUVFRcYHSggGBomHhgVITIhJSkrLi4uFx8zODMtNyotLisBCgoKDg0OFRAQFS0dFRorKy0tKy0tKysrLSsrKy0rKysrKystLSsrLS0rLTcrLSstKystLS0rLS03KysrKysrK//AABEIAQMAwwMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAwQFBgcCAQj/xABPEAACAQMBAwcEDQkGBgIDAAABAgMABBESBSExBgcTIkFRYTJxgZEUI0JSVHOSobGywdHSFRckNFNygqOzM2Jjk8LwCENEosPTg/EldOH/xAAYAQEBAQEBAAAAAAAAAAAAAAAAAQMCBP/EAB4RAQEAAgIDAQEAAAAAAAAAAAABAhEDEhMxQSFR/9oADAMBAAIRAxEAPwDTeX+3JLKye5iCl1ZAA4JXrOFOQCDwPfWUjnovxxhtj/DIP9daPzt2LTbLnVDgqUk9COC3zZ3+FfN/RnOCcHuIxQaX+ey9+DW3838VH57b34Nb/wA38VZv7GbvWgWrd4oNKXnvvPgkHypB9tKJz3XXbZw/Lk+6s1W072pRbRe1jQaeOee4+CRfLf7qRl56brstYR52kP3VnRtxjcf9+urHzf8AI9doyzRyytGI0RgUAJOpiCDqz3Cgm256b39hbD0Sn/XST889/wBkVt8mT/2VYvzLWvwq49Uf3UfmVtPhVx6o/wANBWG55to+8tvkSfjpNueXaXdbf5b/AI6tY5lbT4Vcfy/w11+Zaz+E3H8v8NBUV549p91v/lt+OnEfPLtDtjtj/BIPokqzDmWs/hNz64vwV4eZi07Lm5/lfgoK7+eu+H/T2x9Eo/10fnxvPgluf4pBU83Mza/CLj+V+Cgcylp8JuP5X4KCDHPnd/BIPlyV4efK7+CQfKkqfHMnZ/Cbn1xfgrr8yll8IufXF+Cgrbc+N72Wtt65T/qrn8+F/wDB7b1S/jqynmUsvhFz64vwVweZWz+EXHri/BQV5efC97ba2/m/jrr89978Ft/XL+Kp/wDMpafCLj1xf+uvfzLWXwi59cX4KCtvz2X54Q2w/hlP/kprNzybUPD2Oo8ImP0vVtPMxZD/AKi59cX4K5PM1ZHq+yLnf4xf+ug1qM5APeB9FeV7GuAB3AD1UUCG07QTQyQt5MiMh8zKV+2vlS7tiR1v7RCUf95Dpb5wa+ta+ceX9h7G2rcx8ElInQcN0gy3/droKNrIpZZKeXln2ioxkINFOw1ehzTlNjTDGoxRschY3ljSQkAEjST1TgjqsVIzwpncK0bFHUq67ipGCO0ejGDntBBoFknxxrT+ZBgZ7kj9kn1zWTF60rmJb9JuviU/qGg23NGqks0ZohXXRqpLVXmaBfVRmmd5dCKNpGzpRSxxxOBwHiaiX2tdxnXLbw9GAWdY5ZHmSMHe4VolWXG7IU57tRwCEvf3wiA3M7sdKRrjU7YzgZ3AY3kkgDtqNvNqXkKmV7RGjUamWOYvKFHEhWjVXI7g3mzS19E/TxXMYEiokkbICoYrIY2DxliFJygGCRkNx3YKN5tTog13cL0aIuhEyHkcuykLhMguxVVVFLcT34oJXZ+0Y54kniYNHIoZGHaD9HmpYvVY5CbOktrGKGUYk67suc6DJI0mj+HVjzg1PaqBfVRrpHNeFqBfpKbveJ79flD769DVS7yS91wCBD0ZjjYEICpLAFukYjdx7xurPkz6s+Tk6fFxEobeCCO8HP0U5tE4eJ+jfTDZse4+LyH+YwFS0A3+YfTXcu47l3NnNFFFVRWNc/uztL2t4B76Fj2nB1oPUZK2WqVzwbP6bZkpxlomSUeYMFc/IZ6DDkIYU+2Ds86pLhUDNCF6PUyovSuwVTqYgZC6yN+QdJG8CoHZ0+OoeIq/bGtLedI7SXUrNGksLoRrEheUS6QdzkjQNPEiLdvVQSupeS73VhDFGAt5B0ksQVkIZy5M0RZCQrNhJFOd5PgcVa7lW8gKlSl1AGOnBBOnUZIwD3hZDp9yyjtdqt82wdoRH9EuYropvCb4rhf/AInIdfOGz2VVkd7m+SYr0d6ssfTRkaemVWUO2nA0y6PKXGGALAA5BIpwatM5h2/Srn4lP6lZtdQhXdV8lWZR5gxA+itH5h/1q5+JT+pRW2Zr3NJ0ZojvNGa5zRmg5uoFkRo3GVcFSOG4jB39lNre1cMrPLrCA6eqFJJGCzkEhjjuCjeTjhiN5b7aezsprmMKXQLp1Alcs6pkgccas48KhdhzbYuLeG4W5ssTIsgDQS5GoZwSJMbuFBa7eF4oViTBKDQmc4CAkJq7ThcDHaRxHGk7bZyq/SuTLMODt7kHiI1G6Mebee0mshh51L/2QsJ9jMvTCLUscg1L0gTUuZO0bxVut+Utwbx4UnWVhemA2vRDUlqCMz9IuCunJ3tkHGOJoL7RVMsdryS31xA170fRXAjjgEUba0EUbkFyuRnLDOc7qc8r+UclvJGkKh+jHsm77StoraG0/wB8liwHaImoLRLKFBYnAAJPE7gMncN9IWm0IpdQjcMV3MBnKnLDDA8DlW3eFRl3tBjeW0CsDBNBcuwwCG0dDoOe7Ejbu3NS8NsiFiiKpY5YgAFj3sRxPHjQKUguz4uHRpjzCnKilUWpZtNOraEKAAAAOAG4Cndv2nx+ikScCnMK4AFVXdFFFAUy23Yi4t5rc8JY3j+UpGfnp7RQfIG0I2jcowKyISrDuZTgg+kGrpsfZUlzYrIRho9RQ7/7EuSGY+5TpOmwTxwT5KMadc8fJwptFGXcl4yYPdIWWN/pVv4jWtbLW3sLTpJCIowoZid2BpCxxjvKoEQAcdPeTQZNbcrLuECK5jW4RTjRcLllI97J5QPDfv7KcbU2hBeNb3EOqO6jnhXQ7apOjyScScZY105y3WUFgdxFSu0rqKdi3sVooJN0CZHSzsfJ6OAjIQnuZVGSd5OKccoORUVlYTSoHa5dRklgeijyGmCYxu0gqW3k5xwNFY/fxqZHK+QXYr+7qOn5sVf+YtP0q5+JX+oKo8sdaBzHp+lXHxI/qCg1/TQRSpWuSKITxXOKUNcmghuVeyTd2c9sMBpIyEJ4BxhkJ8NQFVnmj2sTbGwlBS5s2KNG25hGWypx2gElc+A7xU9yh2zd25zFYPcx48qOVdYPbqjK59WfRVD27tGW5lS4/I20ILlPJnhYpJj3rZjIdezDDhkUGZ29m8N2kEgxJFcRxsP7yyqD6O0eBrYVns0mu5lujDc2t3LK7MnlxSFFkgChvbkYqAMEEPp3cM0262ZcXN1HcT2e0Ok1xanMMSg6GGGk0RqDgYBOOAFatZcl4xJJLOkcj+yprmBsEmMSIi8SOPVz2jIU8QKCN2QJNEm04LgLbXJ9lvE9uGk0rGqsgcS4BKx9x3mg7Ns2KXl1ELhr+WMRF0UmKOSIGKLBY4VVU5IO9mJqY2DsQw2EdjIwJWEwsy5xvBUlc+eo+02FdkWkMzwdDZsjBo9euYxRNHHlWGI+IJwWyRuxQR+0tmvZi06K4ZpohPBbxiDpnkjkKuEwZFA0JGBrZgO/FW7ZV80yktDLCynBWUKD35UozKw8xpntrZcrywXVuyCaDWumQMUeOULrQld6nKoQwB4cDmjkxsyaHpjM+oyya1TpJZhEuhQUV5d5BILcAOtuG6gnVFKoK4UV2y7vpoBDqYDs41IUzsF4n0f7+anlAUUUUBRRRQZzz4OiWcE5GZIrqJ4/RlmHpC/MKacppJr+7hhtNDgRJMjNvihEm83LrwdyCqoCDgiQ+Iac/l1lba3zxMkhHmAVfpaqnzY8sZLeZbGRlEUuIlmK5kjxraOMHOCmp3ABzgybtx3BqOytlWlgzSSSGe8IJeZz1gAMtvORGgHEk7hjvAMrdXyXGz5ZyMJJDNo1biyaW0tg7xqADY7iO6qnygsS862MLYiuTAGbOWaMdLLKxbifIAA4DBwBk065xNpiKFrdQAioI0A3dZ1KADwEZl8xA76DGJEq+cyS/pVx8SP6i1S5Vq98yq/pU/xI/qLRWtkVyRSprhqIRNcmu2FcGg4NcmujXJoCiiigKKKKAFKolcIKcigAK6BrwV1QKWwwSOzj9/2U4pvBx9H2inFAUUUUBRRRQYdz6N+mwj/AH9R6yiYb61bn0H6bEf8AAH9R6yzi4HjRWlbB5byxCFpolmkhzokLFGIZSpEhAIfiTwBzvzvOY/bm2pbuQyyYG8kKM4GcZO/eTuG/wA3AACHg4UsKDhxV85mB+lT/ABI/qLVFIq+czI/Sp/iR9daDWzSTUq1IXMoRWc8FBY+YAk/RRGYXG3ru/wBoXFla3y2YgbRGBEsrTFCwmJLcNJXh4imSJtKVpIrXb8U9xGG1Q9HHG3VOlhkqe3dnGKr/ADTzmTayyHynWdz+8wLH5yatPJmOxFxfXGz0lfaEPTe1zMFVmaRtXR6eILLjf3jhnNBnc3ODtZSVa8dSpKsCkG5gcEHqcciuRzjbUPC9Y/wQH/RVi5I4h2debXWJJ74TMvXXUItRQu+js3u7HhwA4CnXJraTbZt7uO+jjYQxGSO6VFQxuASFyN3ZnHcCDnNBUjzj7UHG9PpSD8FdjnH2p8LP+XD+CrVse8ms9nWpkuLSxWUa4z0DXM06nrEuuMe6XhvwV4ZxXXLWK0tdsWdxJAGikj1zRpHkM4DqsnR9pBKkjj1O+iqmvOVtTsvP5cH4Kkto8rdtQRW88l0BHcqzQkLASQunORo6vlLU9yunkurG4mt5rW9tQQ+RGIp7VQQcAADOPHBxnjTfl9yhnOzNn74wLuGQTN0aYBxER0e72vi3Du8KCtDnK2mON5/Lg/BT6PnF2n23Z+RD+CrrtO6tdmS29sLmG3tgis8LWjzNcKSQ7GYbiTjs4HjkYFRWyXtraDaW0bFFcxzrFAXQ4hjcRs5COMqAzsN/YgHAUHl/yg2nHZwXy7REiTN0elY4so4VmKsdGCRpIPjWocjL+W4soJpsdI6ZYjdnDEBsDgSAD6ay/lftR7jZFnPIiq73EhbSoQPpSVek0jvAHqrW+T1n0NrBD2xxRqfOEAPz5oiSg8o+YfbTim9txb0fbTigKKKKAooooMS5+P1qD4g/1G++srsYWklCIpZicAAZJ3fdk+g1qvP5+sW5/wAF/r//ANqkcnsQwNKBqmuCY4lAydIbT1fO4OR3rHjtopdrGWNQzr1ScagyOue4shIB8Cc14Ku95shraG3h6JpioeO4CgnJf22RMjjpZkA7QVbG8VT722MUjxHijMndnScZx48fTQIGr7zNfrU/xI+uKoZq+8zX6zP8SPrihWstTDa9p00MsOor0iMmocRqUrkeun7Uk5ojF9lc3G1rOfp7aezDqGVWZpd6sMHKGIges4pKw5vNsQXJvIp7RZizsTrlIJkJLgqYcEEnh5u6tmNUW8509nRzGEtIyg4MqpqjB4HGDqYeIBFBX7bklt6O5ku0ubQSTY6VdUhjfChRqjMOOA4jB4795rvbnJrb11GYHmsY4j5SQmSMP+/7USR4Zwe2tNt7hJEWSNg6OAyspyGB3gg9td0GX7P5ObdhgS2D2DpH/ZGQM7xd3RsYsDHZkHFe3WweUMhgZp7PXbtqjcatZJQxnWTEQwKsc7u2tE2rfpbwyXEhwkSM7eZRnA8Tw9NY1syTbG2WmuYbhoVjOEQSPGmojIiTR5RAwSzd479xU9tbk3tyeJ7cnZ8UchzL0IeMyeDnQcjzYptbckNuJaNYdJZvbsrKFdnZkDZz0bdGCvE8c47KmuanlbPeCa2uetNBg68AFlJKlXxu1Bgd445qwbe5Y2dnNHBcSMjyLqB0MyhSxUF2HAZB9W/FEVXZexOUEMSwh7CVYxiMza5HQdgVtA4eOeFJbE5Kbdt5ZZ0ls2ackzCRnZJGJJ1MgiAB3nhjjXPLXaUku2tnW0cjCNTDL1GIDa5CWbduYaE9RPfVr5fcsPyfEgjUPcykiNTvAA3F2A3kZIAHaT56KjTyX2tdAW99Na+xTIruIwxcBSD0cftahVOMcd2e3t0kVSObblZNerNFcqFuIGAbC6cgkjBXsYFSD6Ku4ojq290fGl6QtDx8/wBgpegKKKKAooooMV5/v7a2+Kk+utUzZNz7Ga3utOpliRbdMZzIy6nlxw6pkwNxy2Nx0EVcv+IA+3W3xUn11qA5J3UEAW8uGPtVvBFAEwZCX6V5OjzuRtWsa/cjVjeVoqwJsW/ucPdOlqsnY2priTtwsYJd+3qkg+FRfKWOL/lEkQssGokMWAiU4YjcSHWUbt2/A3AY8u+V005MVtEIFk3HQS80g7elnbrEY48OBycUntfZzwQxJjczF2bs1lF0IR7nq5cZAyrjtBwEM1X3mZ/WZ/iV+uKoTVfeZn9ZuPiV+vQrWGpJ6VakXoinc6e1zbbOlKHEkpECHOCNedZHiED1nmyuScI2DPeSIDM6tLEx4okbaYwhHANhie8OO6pvn8usRWsXe8snpjRVH9U1cIOT6TbLjsGZkRreJCVxqGFU538d4oKdzY7fFtseeebJjt5pAgzvOpY3CLntMkh+VVdHOLtcA3xRDadJ0eno16INjOgOPbM43aicZ9VP+czZabO2bbWETMyvO8sjNjU5VeJA3AdZQB3IKsd7slI+TrQkDq2nSnd/zMCbV59VA05x+UKXGxVnhJC3DxLjdlcMWdG8QUIPmqa5q7QRbLgPDWHmY/vOSCT4KFHorKInZtguM9WPaC48A0C5A9JJ9NTVjy9X8lSWCxSLJFaaOlyNJ1SJE3Dev9ruPeKKXHOPbW08z2OzkMLNmaYMyNJvOH3KQiklsA8c9lXW5tbPbtkrjI46HwOkhkHlKR29mRnBBB7iKbzdXljFs97eeWMT3rSRhGycjHRRh8A6F1ZwWwMmqzdz3mzLR9nSDopblxK+HUkRBej05UnSXZDnf5K+NEa/yG2JDbQrCJ4rqaAuBIAhaJWOejXezIvhntPmqpbJX8pcoJZGGqG0zpHufaT0aD0yGR/4arGzrMbN2parBN0jCJHnZcaMMjvKgI4oEAbf4GuuQVjtVopp7HhKeimbMSsW0689feP7Q7176C9c2rB9qbTlTfHqYZ7y0z4P/a1aitU7m15PpZ2pUSJJK7ZldGDqGG4Rhhx07/STVwU0Ctvw9JpWkLQ5B89L0BRRRQFFFFBiH/EEfb7Yf4L/ADyD7qhOQ3JIbQspG1ssttI2jChg8ToHMY3jfrDkb9xc9+6W/wCII/pVuP8AB+mRvuqy81NxHb7HW4fcqyTFz3KZghZvAAAk9gBoIrkvcWMDx9Mrex2AEc2lRCX7Unx1gwO4qwXevWU4DVfuVexI7mEsADlcEjfqUnUr7uJVjrB7tY90agtscmFnZ7mwlWOZ89NA4DQzY3ESx7wGz7rB457c0c3t/JHI9hNG0WlS3QudXREYz0bEnVCwJK7zgo4yRiismmQqSp4qSD5wcGr3zL/rNx8Uv16pe2Jw880i+S8kjL5mckfTVz5lv1i4+KT69BrTUi1KtSL0Rjv/ABAj9TOPcXQ9P6PWi7Q2ibfZ73SgMYrbpVU7gSsWoA47KqvPds0yWcc6jPQS5bwjkGhv+4R03TlLFNyelJkXpUtjbSKSA3SFehTd3NlSP/ugpHLHlBNtGxhuJkQPFcSwMYwwUh4Y5FOCTg7mHHsq+crNsoOT6yAj2+CGJR/ecKHA8QA5/hNQfN1yZF7sm6hc6ekuC0T4zpeOKMBsdozlT6aZQc2+1ZTHaTyKlpCzFWDq6jVvYxoOsWPZqwBk+OQgri6WDYsdsRmW7uGuMe9iiIiDfxFMD+Lup3B7Gh5PyN/1N5OE7yegmV8DuQIM+dx3io/a9n7MvLpIN0NnBKIxxxDaJoQZ72YZz/eNc8mOSk9/BLKsqiG2Ep0HJbWYukARcYwxVQTns4cKKs/NFyLhnH5Qmw4SQrFH2a0wS8nfvxgek9mGi7MG2NtXaSO6xoJQGXBKiErCmMjGC3Wx4mrJzEXeq1njz5EwYDweNftU1A7A2guyttXS3WUilMoD4JAWSUTRPuGSpA0kgbjnuNB1tzk/bbEiYlmubm6jmgj3CJYkZNMkoHWJbrKOPb2ZNWvmMmV7GaLtE7BvM8UeD8zeqqx0/wCW9sxlATZ22k5IODGraiWB4dI+Bg79I8DT275KbU2fcTPszL284IIBjygJJAYORgrk6XHYd9BMcy50G9t1OYo5V0nxzImfSEU1pwqmc3WxksIvY0ksfsyX2+SMOCwUYUYGcso99wyxq6CiOrLgfPTimtkeI/32/dTqgKKKKAooooMF5+mzfwjutwfXI9S/NBerJA9nIAUkLxsO5SpYZ8W6SQf/AB1E8/a4vom/wF/qSVVuSG3msp1mVdaZGtM4yAdxB7GGWx4Mw7cgrTOR8D9L7EkbTJaCWLpRuJEDx9EZO9THMozxAUjOCQWPLrldmZ4I0UTRo0ElwrHer6WeNF7N4wSckdcDjmo3afLpWaeS2hdJbggs8hT2sBVUBEUkMeqpJY4yo3bqqiDtJyTvJO8kneST2mg8ar/zKn9Iufik+uaoD1f+ZT9Yufik+uaDWmpFqVY0k1EIXEKSK0bqGRgVZSAQykYIIPEVm19zN2rSa455Y4z7jCuVHcjtvx+9mtMqE2jytsYJDDNdRRyLjUrEgjIDDO7uINA+2PsyK1hS2hXTHGMKOJ3kksT2kkkk95p3URszlTY3D9HDdwyOeCh11HzKd59FS5oK3Y8j7S3W56CPS1yrK5LM24huquT1Vyx3D7KoXMKzYvIWBC+06s53NiVWU9xxjdWvVwFA4DjvPie80GO8yTdFeXlsfegemGVk/wBdX3lzbbNaIPtEIFXIRiWWTvKxlOuf3RuqhbC/RuUs0fASvMvn6WMTr8+Ksu0ubVLq9e7urmSWNjlIgNOlf2evJwg7lAPjneQrFly0KA2ewtnkAnJdg0jseAZhnduHF29AqQi5B7Xvutf3uhTxj1GTd3dEhWNT5s1pmzNnQwIIoYkjQe5UAD0958TT9aCH2FyTtrZoZQGeeGEW6ysxyUBPFQdOd5GcbgcVYhSa12KD2y4t6Ptp1TWz4t6Ptp1QFFFFAUUUUGF8/wCv6VD8R/5GrN7Rt1aVz+/rUP8A+v8A+RqzKyNFS8IpyBXNhaySZ6ON3xx0Kz48+kHFKEY3HiNx8/aKBGSr/wAyf9vc/FR/XNZ/Ia0DmSP6RdfFR/XahWsvSTUq5pJqI4rIeeKGGO+sZTGCHZmmwgLSqkkI0sPdnTlQD34rXjWbc6uzLl7mwuYLeSdYGZnEYyciSFwpxwyFO+gqPK+4sbia1jsLf2FJ0mWmkiFqo3jSfEg789+7trSeW3LD2CYoIoxNdT7o0LaEAyF1u3YCT9O8AVVeWU+0NrxpapsuSECTWZJmGF3MuMlRgdYk4yd3CnHOByNnYWdxDGLtraNIpoW/5yJjeN+/PWyOO8EZxQLXHLa9s5YvyhHatBKwTXbSMxjP94Md/f5gd/ZUzyn2vtFLhLeytY2Rl1NcTFhCrdY6SV4blG/f5Q3VTrSO1mdI4uTUoYsvSGRWiRFz1irNgMQOAOmleXFlL+UxLd21zd7N0ARRQamVW0jykUjfqDneRnK7zjFBJ8mdsCXabW97aWy3yR6o7iHrhkCjIBOSDpbj4Ebqbx8vr/2VLYewY2ul3RqrkKDgNqlYnAUIwO48cDtqE2JYz221o7pNlzQ20g0JGoJ6NZMR65SMhW4sQeANWTYezZhygvJ2hkELQ4WUowRm02u5WIwT1W9RoHvJXlXdvfNs2+gjjm6PpUaIkqRu3HJPYeOew7qZQct9oXMtx7Ct7Zkt3ZDC7v7IkCsV1IoIHZ6PGvNqw3EW34rpbWWWF4UgLopKrrJVmZgMALkE+FRHK+26aSXOyLuK/wBbdBcW/WjkGcJJK6bgSMZI3+I7A1+ylZ0R2QozKrMh4qSASp8Qd3op2Ki+T8cy20C3BzOI0Ep49fSNWSOJ8akxQe2fFvR9tOqbWfFvR9tOaAooooCiiigw3n7/AFuH4j/yNWb7Dt+llSPONR3nuUAs7eOFDHHhWg8+0mb5F7rdPneSq/yG2eGyolMM0ySmKUe4WJog3DeA2qXURvCxd2oEq17P2YbqzmEKFXRyYIzkdWJUZlUHi7B3Yni2gd26OvAtzb9Mp9ujXL97ADeG7TuVmB7kYbuqBLLcbSsVV5omkRSGWaNukj/eyMr2kZYDcSBpzmol7xZbkXcC6VeRBcRDs6Rwruo/Zvn+FmI3ggkKrK1aDzIH2+6+Kj+u1ZzdjSzJ70lfUcVofMa3t918VH9dqDXmrhq7NcNRHBryvTUPym28lnF0jDU7ZEacNTeJ7FHaftNS3Syb/Ie7Rv4oE6SaRUXvJ4nuA4k+Aqn7T5z7OLGI5nycLhVGonuBOfmqhbSv5bmXppnLMdwHAKO5V9yPDj3541X0uws0km7MY0p24JZVLLjgRk1n5L8b+KT22jZ3L60lID9JAScDpVAGeGCwJC+nFWkHtFfPDKY0Ud6jcTn07hVg2JywmtrSW23klfaDnJjywVwM9mDkDsOaTP8AqZcU+Lvt3l5FA7RxIZmU4Y6tKA9qhsHUR4bvGoc86mg+2Wp09pV8kDv3qB84qnyrhR3kd1MLrAIzkZIUtuHlEAneP97658ld+LFunJ/b9veJ0kD5x5Snc6598v28DUwhr532HtBrZ0nhYhkLAdzJqOUbHFSN3oz3VvWwtqR3UKXEfkuN47VYbmRvEHd8/bWmOW2OeHX9+JNaVWkhXqsa7ZlrXym9FOabQeVnwpzQFFFFAUUUUHzxzzy52nKD7lIlHm0av9RqB2bazvbxXMIdXtppAjLkEg6JMoe0gmTOO4D3QFSnLYeztsTRoThpejyN+FiUK7DvOEYjvOBWw7L5O21tbETKioEUOScBFTJRQ+4jQSSG46yz+UxoqgbF5dov9vGyMeM1swTUTxZ4D7W57zj0V5tNYRNbbQs2R1edIZQi6FYycQ8J/s3wGyvknqsO3CO17Szn6WSBvalbCzOjxq7scBE0A9M5PuQq9+CSSUdtckpdmWjXckwM7sscaIG0pqDapCTglwpYDcApc8SRgKNeN13Gc9Zt/fvO/wBPGtF5im9vuvi4vrtWXFq0vmIPt938VF9d6DZia5zXleUR7WK8qtrm6uXkzmNSUjHcinGfScn0itf2rIVglZfKWOQjzhCRWEheqMdw+jjWXJW/DPdKQd+7PdVc2fEJJZc4AKvvOBjtByT3gVN7Sl6OIt2ncP8AfmqN2Da8CcYZtR79KHO847WxXHxrfcP7gEADHWwOI7MdlR9xkYzx3j0aTwFPbxizbhx8c47uNNzbGRiqAt0cbO+N/Abz5gDSRbUmvWAbswCKZX44ZGRqXs8cD58Ujs2509QnzebtFLXnDA9G/ge+udaq73EdYMRrTjpbxG41onNXtropzbMfa5vJ/uygYHygMedVqhSDriUeTLhW7dMg7G3U4iLIchsMCCCBjDKcg/NV3qyueu5p9KAV7mo/Ym0Ont4p/wBoisfAkbx680/WvS8dK23E+G77/spzTOxfeQfP/v5qeUBRRRQFN9oXSxRPM25Y0Zz5lUsfopxVG55NrdBs10B607LCP3T1pPRpVh/FQZbzSOJdrhn3kxTNv9+dLH/VVu2vdz7SuDHDD0yRnqI5K20Q9zNcY/tZGHWCcFUjcTqxlvJi9kt5kuo90iNqGeB7Cp8CCR6a3HkRtSO5teitF9jhGKSasOwYjUSpDAnOfKOPJ8KDvZXJ2K1Zbm8nE1yowmcLFCMZPQx7ggA3lsDAGd1HL4xz7KuZwMqbcvGSCN3VkRgDvGcId/cKqWhr+5TZ4UiMu8125JLtbRyskUTMNwEjKXKqFHXBwSCS651tvgW8kCHAJEAA4MSyO+7s0rGwx3TKe0UGMVp3MR+sXfxUX13rMgK03mIH6RdfFRfXaitkor3FGKI4kUEEHgQQfMdxrCdofosklvKDqiJAPvk4o3pGK3G4Y1Q+XWxFuQJB1Zl3K+OK8dLDtGd/hWec2148tM4EbzSKxClV6yLndvJ3v3YwOqM54d9KuCOqpJz5TntP2DuArySyuI+qUJ8R1t/fnjSAsLl92l/oHz1nqtu0JzThNynLn1Ad5rUOavk30UL3My5addIB/ZHiSO5voHjVb5JclwHV5hqwchOK5/vd/m4Vq1uxIrvGaZZ5Mb5fcjmtJDJHk27Hqt7wn3D/AGHt89VqK8IGl8g99fQW0YNalSoZWGCCMgjtBB41mm3eQwyTDlB70jUvo7R89LFxyUjIION4YEHhv7iO4jsNJLcSjKSHOkDDDiQRuz41NHkXcg5AX1sPsqZ2HyQZGV5BrK4wMHAI4Ek8a56uu7TeR6GKzgibyljGrznLEejNWGM1W9mROB1qnoG3Vriwy9l8aWB7KfUyfeKdxtkA105dUUUUBWA8+e2ulvBag9S3QZGeMkgDt6l0D0mt9NfKPKq+Fxe3NwfJaZ9PiAxVfRgLQN4pgEBp1ye5Sy2c3SxbwcB0yV1AHK4YeSwycHB4kEEEgweSx+jwpZI6K1HY3ODZQPcXCRXHSTheoVjOhlMjECTpN6ZfPAEY4VQtvbXe6k6RhpUZCJnOkE5JJwMsd2TgcAAAAAGGK900HGK0zmK/WLr4qP67Vm4FaVzG/rFz8Un1zQbDSCXkZZow41IQGHDBI1AZ4ZwQcDvpxmo242JbOzM8SlnOpjvySYjDvI340EjwznjRD7UpwMjfw3jf27u+mgaByyhkYrvYAg4Gpl3929WHnBpCLk5aqyuI+um9TqYnOpGJ3nvjQ+vvNeT8mrVySY97EkkMw3l2kzx98zGhtxeQWaMEkMaudOFYgE63EaYHixC+c12NmW2rTpXUBqxu4bxn5j6q7uNg27lWaPLIqohyRpVNQUDfu8o/N3U2TkpaAYEZ7R5b5wQAe3uA9Qqai7p9HbQqwQaQxGQN2cZAJ+cUsZI1ZUJAZiQo7SQuoj1b/V301h2HAgQKmkI4kXBI64UICSOI0gDHDFe2+xYElM6p7YSW1Ek721ZIB4eU3rNXRs4ivIn1aXU6CQ2OAIzkZ4HGD6jXEF5DIdKOrNpVsf3WLBD5iVbHfpNNJ+Ttu+NSsQrF1Gt9KksHOkZ3DUAceHdXI5MWu49FwKMDqbOULld+eHXb1+FNIkW6McdO/d3959HA0jNcwoyIzoGkzoBwNWOOKZnkxaY09Fu06NzMOroWPG4+9UfOe2l22FblVQxghY3iXOSQj41gE9+OPGmg4LqPdLvOOI493nrmK6QgEMuDjG/B38Nx358KZycmbVskxDrFyd7f8zGvG/dw9HZXjcnLbVr6LLZRslmO9AQm7PYCR6aCaicOoKkEHeCN4I7we2ndt3d1RVhEIUWNBhFGAMk4A4DJ31IwNvB7xQOqKKKCE5a7V9i2NxP7pY2Cfvt1U+civlYx8AeA4DifOfGvovnmb/8AGOO+SIf94P2V8+M69tAkg7gaUxXhlXvHrFctKvvh6xRXhc9grrpD2qaRzv3HJ8+aeW9pMeEUpHfoY/QKBITDx9VaLzJ3iLcXOpgoMSY1ELn2w8MnfVJFjL2xSDzo4+yvWte9T6QfuoPpP2fF+1j+Wn3157Mj/ax/LX76+aJbVccB6qjpbb+781EfVQvI/wBonyl++vfZkf7RPlL99fJ5QD3OPRiuNa9pX1ig+s/Zsf7RPlL99Hs2P9onyl++vk3pE719Yr0Mh7V9YoPrH2bH+0T5S/fR7Mj9+vyl++vlFYc8Fz5hmll2bIeEEh80bH6BQfVHspPfr8pfvo9lJ79PlL99fLP5Il+DS/5L/hoGxpfgsv8Akv8AhoPqb2XH79PlL99eezY/2ifKX76+WxseX4LN/kP+GvfyNN8Fm/yH/DQfURvov2sfy1++uTtCH9rH8tPvr5fGyJe23lHnicfZTee2K7ihHnGKD6n/AChB+2i/zE++iPa9up33EOPjI93z18wWcS47KRuAN43dooPsLNFcQLhVHgPoooO2GeNcGFfer6hRRQcG1j94nyR91AtI/wBmnyV+6iig7WBRwVR6BSmKKKArwqO6vKKA6Ne4eqjQO4UUUHhiXuHqrhrSM8Y0PnUH7KKKDgbPh/ZR/IX7q7W1jHBFH8IoooFBGBwA9VdUUUBRRRQeUUUUBXhUHiBRRQJSWsZ4xofOoP2U0k2FaN5VrAfPFGfpFeUUEjRRRQf/2Q==',
    name: 'Costa Rican Raw Green Beans',
    price: '0.005634',
    onClickListing: handleListing,
  },
  {
    type: 'listing',
    imageUrl: 'data:image/jpeg;base64,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',
    name: 'Hawaiian Kona Beans',
    price: '0.005334',
    onClickListing: handleListing,
  },
  {
    type: 'voting',
    imageUrl: "data:image/jpeg;base64,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",
    name: 'Hawaiian Kona Beans',
    onVote: handleVote,
  },
  {
    type: 'auction',
    imageUrl: 'data:image/jpeg;base64,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',
    name: 'Panama Geisha Beans',
    bidEndDate: '30 December 2024, 10PM (SGT)',
    onBid: handleBid,
  },
];

export default mockCoffeeData;