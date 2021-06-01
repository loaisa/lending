let menu = document.querySelector('.material-icons')
let menuoverlay = document.querySelector('.menu-overlay')
menu.onclick=function(){
	menuoverlay.classList.toggle('active')
}


// шаблон начала письма
let intro = ['$a_intro$', '$b_intro$ '];
// шаблон тела письма
let text = ['$a_text$', '$b_text$'];
// шаблон концовки письма
let outro = ['$a_outro$', '$b_outro$'];
// задаём набор фраз и слов для всех шаблонов сразу
let text_obj =
	{//структуру письма пока оставляем пустой
		structure: [''
		],
// текст для начала
	a_intro: ['Здравствуйте.', 'Добрый день!'], b_intro: ['Привет!', 'Хэллоу!', 'Бонжур!'],
	b_intro: ['Привет!', 'Хэллоу!', 'Бонжур!'],
	// варианты основного текста
	a_text: ['Перед вами — первое письмо в рассылке. Наш $somebody$ рад тому, что вы не прошли мимо подписки, и приглашает вас на нашу выставку, адрес — во вложении.', 'Меня зовут Михаил Максимов, и я — $somebody$ в этой компании. От лица всех сотрудников я рад приветствовать вас в рядах наших единомышленников.'],
	b_text: ['Если ты видишь это письмо, знай — наш $somebody$ здорово постарался для этого. Зато ты теперь сможешь прийти к нам на выставку и убедиться своими глазами в том, о чём мы тебе говорили!', 'Ты сделал это, а значит, твой $somebody$ будет в восторге! Если нет — дай нам знать, и мы это исправим.'],
	// должность
	somebody: ['директор', 'руководитель', 'начальник отдела'],
	// текст для концовки
	a_outro: ['Спасибо, что подписались на нашу рассылку!', 'Если будут вопросы — пишите.', 'Если письмо попало к вам по ошибке — проигнорируйте его.'],
	b_outro: ['Теперь ты один из нас!', 'Здорово, что мы теперь — команда!', 'Рады, что ты с нами! Пиши, если есть что спросить.'],
}
// генератор случайных чисел в диапазоне от минимального до максимального
function randz(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
// собираем письмо в одно целое
function generate_structure() { // случайным образом определяем тон письма — официальный (0) или неформальный (1)
	let mood = randz(0, 1);
	// результат помещаем в переменную вместе с тегами
	result = '<h2>' + intro[mood] + '</h1>\n';
	result += '<p>' + text[mood] + '</p>\n';
	result += '<p>' + outro[mood] + '</p>\n';
	// возвращаем результат — одну строку с HTML-разметкой
	return result;
}

// убираем знаки доллара после замены шаблонного слова на реальный текст
function parse_keywords(string) {
  // задаём шаблон поиска таких слов
  pattern = /\$\w+\$/g;
  // проверяем, есть ли в строке нужные нам слова
  keyword = string.match(pattern);
  // если есть
  if (keyword) {
    // пока не закончатся все такие слова в строке…
    for (let i = keyword.length - 1; i >= 0; i--) {
      // убираем значок доллара
      keyword[i] = keyword[i].replace(/\$/g, '');
    }
  }
  // возвращаем слово без знаков доллара
  return keyword;
}
// выбираем случайный элемент массива
function randomize(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
// меняем одно слово на другое
function replace_keyword(source, keyword, variant) {
  return (source.replace('$' + keyword + '$', variant));
}
//подставляем случайным образом готовые слова вместо шаблонных слов со знаком доллара
function bake(object) {
  // переменная, в которой на выходе получится готовый текст
  let result = randomize(object['structure']);
  // пока есть шаблонные слова со знаком доллара
  do {
    // выбираем их
    keywords = parse_keywords(result);
    // если они точно есть, то
    if (keywords) {
      // пока они не закончатся
      for (let i = keywords.length - 1; i >= 0; i--) {
        // случайным образом подставляем вместо шаблонных слов с долларом слова из наборов
        if (object.hasOwnProperty(keywords[i])) {
          result = replace_keyword(result, keywords[i], randomize(object[keywords[i]]));
        }
      }
    }
  } while (keywords);
  // возвращаем готовый результат
  return result;
}
// подставляем текст с тегами в нужне место на странице
function send(text) {
  document.getElementById('text_here').innerHTML = text;
}
// что мы делаем по нажатию на кнопку
function get_text() {
  // заводим переменную для структуры текста
  let currentObject = text_obj;
  // наполняем структуру текстом с шаблонными словами
  currentObject.structure[0] = generate_structure();
  // меняем шаблонные слова на нормальный текст
  result = bake(currentObject);
  // выводим результат
  send(result);
}