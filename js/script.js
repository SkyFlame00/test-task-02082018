let container = document.getElementById('products_section');
let products;

(function renderProducts() {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'products.json', false);
  xhr.send()

  if (xhr.status != 200) {
    alert('Ошибка! Товары не были загружены');
  }
  else {
    products = JSON.parse(xhr.responseText);

    for (let i = 0; i < products.length; i++) {
      let html = makeTemplate(products[i], i);
      container.insertAdjacentHTML('beforeEnd', html);
    }
  }
}());

document.addEventListener('click', stepperArrowClicked);
document.addEventListener('change', stepperInputChanged);
document.addEventListener('click', eventUnitClicked);

function stepperArrowClicked(event) {
  if (event.target.closest('.up')) {
    let input = event.target.closest('.stepper').querySelector('.stepper-input');
    input.setAttribute('value', ++input.value);
    changePrice(event);
    return;
  }

  if (event.target.closest('.down')) {
    let input = event.target.closest('.stepper').querySelector('.stepper-input');
    if (input.value - 1 > 0) input.setAttribute('value', --input.value);
    changePrice(event);
    return;
  }
}

function stepperInputChanged(event) {
  if (event.target.classList.contains('stepper-input')) {
    let input = event.target;

    if (input.value >= 1 && input.value < Infinity) {
      input.value = Math.round(input.value);
      input.setAttribute('value', input.value);
      changePrice(event);
      return;
    }

    input.value = 1;
    input.setAttribute('value', 1);
    changePrice(event);
  }
}

function eventUnitClicked(event) {
  if (event.target.closest('.unit--select')) {
    let units = event.target.closest('.product').querySelector('.product_units .unit--wrapper');
    let item = event.target.closest('.unit--select');

    if (units.children[0] == item) {
      if (!item.classList.contains('unit--active')) {
        item.classList.add('unit--active');
        units.children[1].classList.remove('unit--active');
        changePrice(event);
      }
    }

    if (units.children[1] == item) {
      if (!item.classList.contains('unit--active')) {
        item.classList.add('unit--active');
        units.children[0].classList.remove('unit--active');
        changePrice(event);
      }
    }
  }
}

function changePrice(event) {
  let retail;
  let gold;
  let type = getType(event);
  let product = event.target.closest('.product');

  if (type == 'unit') {
    retail = 'priceRetail';
    gold = 'priceGold';
  }

  if (type == 'unitAlt') {
    retail = 'priceRetailAlt';
    gold = 'priceGoldAlt';
  }

  let amount = +product.querySelector('.stepper-input').value;

  let id = +product.dataset.productPageId;
  let priceRetailForUnit = +products[id][retail];
  let priceGoldForUnit = +products[id][gold];

  product.querySelector(`.retailPrice`).innerHTML = Math.round(priceRetailForUnit * amount * 100)/100;
  product.querySelector(`.goldPrice`).innerHTML = Math.round(priceGoldForUnit * amount * 100)/100;
}

// Определение текущей единицы измерения (типа) в блоке товара
function getType(event) {
  let units = event.target.closest('.product').querySelector('.product_units .unit--wrapper');
  let isUnitSelected = units.children[1].classList.contains('unit--active');

  return isUnitSelected ? 'unit' : 'unitAlt';
}

// Функция создания блока товара из шаблона
function makeTemplate(product, i) {
  let arrStr = product.primaryImageUrl.split('');
  let pos = arrStr.lastIndexOf('.');
  let imageUrl;

  if (pos >= 0) {
    arrStr.splice(pos, 0, '_220x220_1');
    imageUrl = arrStr.join('');
  }
  else {
    imageUrl = '';
  }

  let html = `
    <div class="products_page pg_0">
        <div class="product product_horizontal" data-product-page-id="${i}">
            <span class="product_code">Код: ${Number(product.code)}</span>
            <div class="product_status_tooltip_container">
                <span class="product_status">Наличие</span>
            </div>
            <div class="product_photo">
                <a href="#" class="url--link product__link">
                    <img src="${imageUrl}">
                </a>
            </div>
            <div class="product_description">
                <a href="#" class="product__link">${product.title}</a>
            </div>
            <div class="product_tags hidden-sm">
                <p>Могут понадобиться:</p>
                ${product.assocProducts}
            </div>
            <div class="product_units">
                <div class="unit--wrapper">
                    <div class="unit--select unit--active">
                        <p class="ng-binding">За ${product.unitAlt}</p>
                    </div>
                    <div class="unit--select">
                        <p class="ng-binding">За упаковку</p>
                    </div>
                </div>
            </div>
            <p class="product_price_club_card">
                <span class="product_price_club_card_text">По карте<br>клуба</span>
                <span class="goldPrice">${Math.round(product.priceGoldAlt*100)/100}</span>
                <span class="rouble__i black__i">
                    <svg version="1.0" id="rouble__b" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30px" height="22px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
                       <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_black"></use>
                    </svg>
                 </span>
            </p>
            <p class="product_price_default">
                <span class="retailPrice">${Math.round(product.priceRetailAlt*100)/100}</span>
                <span class="rouble__i black__i">
                    <svg version="1.0" id="rouble__g" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="30px" height="22px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
                       <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rouble_gray"></use>
                    </svg>
                 </span>
            </p>
            <div class="product_price_points">
                <p class="ng-binding">Можно купить за ${product.bonusAmount} балла(-ов)</p>
            </div>
            <div class="list--unit-padd"></div>
            <div class="list--unit-desc">
                <div class="unit--info">
                    <div class="unit--desc-i"></div>
                    <div class="unit--desc-t">
                        <p>
                            <span class="ng-binding">Продается упаковками:</span>
                            <span class="unit--infoInn">${product.unitRatio} ${product.unit} = ${product.unitRatioAlt} ${product.unitAlt} </span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="product__wrapper">
                <div class="product_count_wrapper">
                    <div class="stepper">
                        <input class="product__count stepper-input" type="text" value="1">
                        <span class="stepper-arrow up"></span>
                        <span class="stepper-arrow down"></span>
                    </div>
                </div>
                <span class="btn btn_cart" data-url="/cart/" data-product-id="${product.productId}">
                    <svg class="ic ic_cart">
                       <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart"></use>
                    </svg>
                    <span class="ng-binding">В корзину</span>
                </span>
            </div>
        </div>
    </div>
  `;

  return html;
}
