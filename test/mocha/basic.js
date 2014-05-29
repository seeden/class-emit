var should = require('should'),
	ClassEmit = require('../../index');

describe('Inheritance', function() {

	it('should be able to create class', function(done) {
		var emit = new ClassEmit();

		done();
	});

	it('should be able to bind to event', function(done) {
		var emit = new ClassEmit();

		emit.on('click', function(x, y) {
			x.should.equal(5);
			y.should.equal(10);

			done();
		});

		emit.emit('click', 5, 10);
	});	

	it('should be able to able remove event by method remove', function(done) {
		var emit = new ClassEmit();

		var handler = emit.on('click', function() {
			throw new Error('This function should not be called');
		});

		handler.remove();

		emit.emit('click');

		done();
	});	

	it('should be able to able remove event by method off', function(done) {
		var emit = new ClassEmit();

		var callback = function() {
			throw new Error('This function should not be called');
		};

		var handler = emit.on('click', callback);

		emit.off('click', callback);

		emit.emit('click');

		done();
	});

	it('should be able to able call event only once', function(done) {
		var emit = new ClassEmit();

		var count = 1;
		var callback = function() {
			if(count===0) {
				throw new Error('This function should not be called more than one time');	
			}

			count--;
		};

		emit.once('click', callback);

		emit.emit('click');
		emit.emit('click');

		done();
	});	
});