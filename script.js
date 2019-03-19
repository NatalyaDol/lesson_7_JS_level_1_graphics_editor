var doc = document;

var size = doc.getElementById('sizeSelect');
var newColor = doc.getElementById('color');
var canvas = doc.getElementById('canv');
var ctx = canvas.getContext('2d');// Метод для канвас -  будет в формате 2d.
//Это обязательное объявление переменной для канваса
var xCoord = doc.getElementById('xCoord');
var yCoord = doc.getElementById('yCoord');
var tools = ['brush', 'rectangle'];//массив инструментов для рисования
var activeTool = '';//активный инструмент, который используется
var btn = doc.getElementsByClassName('toolButton');
//var btnClear = doc.getElementsByClassName('clear');

//переменные для круга, квадрата
var saveCoordDown = [];//переменная хранящая координаты mousedown [0]- Х,[1]- Y
var saveCoordUp = [];//переменная хранящая координаты mouseUP [0]-  Х, [1]- Y 


var system = {
	width: canvas.getAttribute('width'),
	height: canvas.getAttribute('height'),
	currentColor: newColor.value,//текущий цвет, по умолчанию черный
	currentTool: '',//текущий инструмент
	brushSize: size.value
};

//рендер Системы
var renderSystem = function (obj, elem, action) {
	obj[elem] = action;
	console.log(action);
};

//Получение коодинат
var getCoordinates = function (evt) {
	let mas = {};
	let x = evt.offsetX;//это атрибут из evt, который следит в браузере за координатой мыши
	let y = evt.offsetY;

	mas = {x : x, y : y};
	xCoord.innerText = x;
	yCoord.innerText = y;

	return mas;
};

//Изменение размера кисти
var switchSize = function (list) {
	return list.value; //будет работать от списка размеров из верстки
};

//Изменение цвета кисти
var switchColor = function (colorInput) {
	return colorInput.value;
};

//Изменение инструмента
var switchTool = function (button) {
	//снятие выделения активности выбранного инструмента
	for (let i = 0; i < btn.length; i++) {
		btn[i].classList.remove('button-active');
	}
	if (button.id == 'brush') {
		btn[0].classList.add('button-active');
		return 'brush'
	// } else if (button.id == 'notbrush') {
	// 	btn[1].classList.add('button-active');
	// 	return 'not_brush'
	// } else if (button.id == 'notbrush2') {
	// 	btn[2].classList.add('button-active');
	// 	return 'not_brush_2'
	} else if (button.id == 'circle') {
		btn[1].classList.add('button-active');
		return 'circle'
	}
	else if (button.id == 'line') {
		btn[2].classList.add('button-active');
		return 'line'
	}
	else if (button.id == 'square') {
		btn[3].classList.add('button-active');
		return 'square'
	}
	
};

//Мышинные события (клики). На все окно
var mouseActionsClick = function (evt) {
	if (evt.target.classList.contains('toolButton') == true) {
		renderSystem (system, 'currentTool', switchTool (evt.target));
	} else if (evt.target.id == 'sizeSelect') {
		renderSystem (system, 'brushSize', switchSize (evt.target));
	} else if (evt.target.id == 'color') {
		renderSystem (system, 'currentColor', switchColor (evt.target));
	}
};

//НЕПОСРЕДСТВЕННО РИСОВАНИЕ 

var startDraw = function (evt) {
	if (system.currentTool == 'brush') {
		drawBrush (evt);
	} else if (system.currentTool == 'circle') {
		drawCircle (evt);
	} else if (system.currentTool == 'line') {
		drawLine (evt);
	} else if (system.currentTool == 'square') {
		drawSquare (evt);
	}
};

var endDraw = function (evt) {
	canvas.onmousemove = null,
	canvas.onmousedown = null;
};

var drawBrush = function (evt) {
	canvas.onmouseup = null;
	canvas.onmousedown = null;
	canvas.onmousemove = function (evt) {
		//прерывистая линия 
		//ctx.beginPath ();
		// ctx.fillStyle = system.currentColor;
		// ctx.fillRect (xCoord.innerText, yCoord.innerText, system.brushSize, system.brushSize);

		//сплошная линия
		let lastPointx;
		let lastPointy;
		canvas.onmousemove = function(evt) {
			ctx.beginPath();
			ctx.strokeStyle = system.currentColor;
			ctx.lineWidth = system.brushSize;
			ctx.moveTo(lastPointx, lastPointy);
			ctx.lineTo(evt.offsetX, evt.offsetY);
			ctx.stroke();
			lastPointx = event.offsetX;
			lastPointy = event.offsetY;
		}

	}
};

//Рисование круга

var drawCircle = function (evt) {
	canvas.onmousedown = mouseUpSaveCoord(evt);
	canvas.onmouseup = function (evt) {
		mouseUpSaveCoord(evt);

		let x1 = saveCoordDown[0];
		let y1 = saveCoordDown[1];

		let x2 = saveCoordUp[0];
		let y2 = saveCoordUp[1];

		ctx.beginPath ();
		ctx.strokeStyle = system.currentColor;
		ctx.fillStyle = system.currentColor;
		ctx.arc (x2,y2,Math.abs(x2 - x1),0,2*Math.PI);
		//ctx.fillStyle = system.currentColor;
		//ctx.fill ();
		ctx.stroke();
	}	
};

//Рисование линии
var drawLine = function (evt) {
	canvas.onmousedown = mouseUpSaveCoord(evt);
	canvas.onmouseup = function(evt) {
		mouseUpSaveCoord(evt);

		let x1 = saveCoordDown[0];
		let y1 = saveCoordDown[1];

		let x2 = saveCoordUp[0];
		let y2 = saveCoordUp[1];

		ctx.beginPath(); 
		ctx.strokeStyle = system.currentColor;;
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke(); // Нарисуем его
	}	
};

//Рисование квадрата

var drawSquare = function (evt) {
	canvas.onmousemove = console.log('Helloooo');
	canvas.onmousedown = mouseUpSaveCoord(evt);
	canvas.onmouseup = function (evt) {
		mouseUpSaveCoord(evt);

		let x1 = saveCoordDown[0];
		let y1 = saveCoordDown[1];

		let x2 = saveCoordUp[0];
		let y2 = saveCoordUp[1];

		ctx.beginPath ();
		ctx.strokeStyle = system.currentColor;
		ctx.moveTo (x1,y1);
		ctx.lineTo (x2,y1);
		ctx.lineTo (x2,y2);
		ctx.lineTo (x1,y2);
		ctx.moveTo (x1,y1);
		ctx.strokeStyle = system.currentColor;
		ctx.fillStyle = system.currentColor;
		ctx.fill ();
		ctx.stroke();
	}	
};


//Сохранение координат при mousedown
var mouseDownSaveCoord = function (evt) {
	saveCoordDown = [];
	
	let x = evt.offsetX;//это атрибут из evt, который следит в браузере за координатой мыши
	let y = evt.offsetY;

	
	xCoord.innerText = x;
	yCoord.innerText = y;
	
	saveCoordDown.push(x);
	saveCoordDown.push(y);
};

//Сохранение координат при mouseUp

var mouseUpSaveCoord = function (evt) {
	saveCoordUp = [];
	
	let x = evt.offsetX;//это атрибут из evt, который следит в браузере за координатой мыши
	let y = evt.offsetY;

	xCoord.innerText = x;
	yCoord.innerText = y;
	
	saveCoordUp.push(x);
	saveCoordUp.push(y);
};

//очистка холста
var clearCanvas =  function() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
};

//Download
var download = () => {
	let download = document.getElementById("download");
	let image = document.getElementById('canv').toDataURL("image/png")
		.replace("image/png", "image/octet-stream");
	
	download.setAttribute("href", image);
};

canvas.addEventListener ('mousedown', mouseDownSaveCoord);
canvas.addEventListener ('mouseup', mouseUpSaveCoord);

canvas.addEventListener ('mousemove', getCoordinates); //активация получения координат
doc.addEventListener ('click', mouseActionsClick); //активация кликов
canvas.addEventListener ('mousedown', startDraw);
canvas.addEventListener ('mouseup', endDraw);
window.addEventListener ('click', function (evt) {console.log(evt);})
