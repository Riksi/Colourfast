var modalBackground = document.getElementById('modal-background');

document.getElementById('help').onclick = function(){
	rules.classList.add('modal');
	modalBackground.style.display = 'block';
}

document.getElementById('close').onclick = function(){
	rules.classList.remove('modal');
	modalBackground.style.display = 'none';
}
