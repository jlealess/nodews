const updog = {};

updog.getDogs = () => {
	return $.ajax({
		url: '/api/pets',
		dataType: 'json'
	});
};

updog.createDog = (data) => {
	return $.ajax({
		url: '/api/pets',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		data: JSON.stringify(data),
	});
};

updog.upvote = (id) => {
	return $.ajax({
		url: `/api/pets/${id}`,
		method: 'PUT',
		dataType: 'json'
	});
};

updog.deleteDog = (id) => {
	return $.ajax({
		url: `/api/pets/${id}`,
		method: 'DELETE',
		dataType: 'json'
	})
}

updog.displayDogs = (dogs) => {
	$('#dogos').empty();
	dogs.forEach((dog) => {
		const $container = $("<div>").addClass('dogo');
		const $img = $('<img>').attr('src',dog.photo);
		const $name = $('<h3>').text(dog.name);
		const $desc = $('<p>').text(dog.description);
		const $scoreContainer = $('<div>').addClass('score-container');
		const $score = $('<p>').text(dog.score).addClass('score');
		const $thumb = $('<p>').text('👍').addClass('updog').data('id',dog._id);
		const $delete = $('<button>').text('Delete dog').data('id',dog._id);
		$scoreContainer.append($score,$thumb);
		$container.append($img,$name,$desc,$scoreContainer,$delete);
		$('#dogos').append($container);
	})
};

updog.events = () => {
	$('.add-dogo form').on('submit',(e) => {
		e.preventDefault();
		const dog = {
			name : $('#name').val(),
			description: $('#description').val(),
			photo: $('#photo').val()
		}
		updog.createDog(dog)
			.then(() => $('.add-dogo').toggleClass('show'))
			.then(updog.getDogs)
			.then(updog.displayDogs)
	});

	$('.toggle-dogo').on('click',() => {
		$('.add-dogo').toggleClass('show');
	});

	$('#dogos').on('click', '.updog' ,function() {
		const id = $(this).data('id');
		updog.upvote(id)
			.then(updog.getDogs)
			.then(updog.displayDogs)
	});

	$('#dogos').on('click', 'button', function () {
		const id = $(this).data('id');
		updog.deleteDog(id)
			.then(updog.getDogs)
			.then(updog.displayDogs)
	});

};

updog.init = () => {
	updog.getDogs()
		.then(updog.displayDogs);
	updog.events();
};

$(updog.init);