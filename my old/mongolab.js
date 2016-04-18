
var foodSchema = mongoose.Schema({
    name: {type: String, required: true},
	//location: {type: [Number], required: true},
	created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
	living:  Boolean
});

foodSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});
foodSchema.index({location: '2dsphere'});

// schema of User item
var userSchema = mongoose.Schema({
    username: {type: String, required: true},
	password: {type: String, required: true},
	phone: String,
    email:  String,
	position: {},
	created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
	foods: [foodSchema]
});



userSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

var Food = mongoose.model('Food', foodSchema);
module.exports.Food = Food;

var User = mongoose.model('User', userSchema);
module.exports.User = User;
