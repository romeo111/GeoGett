var session = require('express-session');	
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;
//var uid = require('uid-safe');

app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  secret: 'hdhy4w5',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

/* Для Passport также необходима сериализация и десериализация экземпляра объекта пользователя из сессии сохранения в целях поддержки текущей сессии, так чтобы каждый последующий запрос не содержал учетные данные пользователя. Для этого предназначены два метода serializeUser и deserializeUser: */
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// passport/login.js
passport.use('login', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // проверка в mongo, существует ли пользователь с таким логином
    User.findOne({ 'username' :  username }, 
      function(err, user) {
        // В случае возникновения любой ошибки, возврат с помощью метода done
        if (err)
          return done(err);
        // Пользователь не существует, ошибка входа и перенаправление обратно
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false, 
                req.flash('message', 'User Not found.'));                 
        }
        // Пользователь существует, но пароль введен неверно, ошибка входа 
        if (!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, 
              req.flash('message', 'Invalid Password'));
        }
        // Пользователь существует и пароль верен, возврат пользователя из 
        // метода done, что будет означать успешную аутентификацию
        return done(null, user);
      }
    );
}));
var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
    findOrCreateUser = function(){
      // поиск пользователя в Mongo с помощью предоставленного имени пользователя
      User.findOne({'username':username},function(err, user) {
        // В случае любых ошибок - возврат
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // уже существует
        if (user) {
          console.log('User already exists');
          return done(null, false, 
             req.flash('message','User Already Exists'));
        } else {
          // если пользователя с таки адресом электронной почты
          // в базе не существует, создать пользователя
            var newUser = new User();
          // установка локальных прав доступа пользователя
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.param('email');
          newUser.firstName = req.param('firstName');
          newUser.lastName = req.param('lastName');

          // сохранения пользователя
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });
    };

    // Отложить исполнение findOrCreateUser и выполнить 
    // метод на следующем этапе цикла события
    process.nextTick(findOrCreateUser);
  })
);

var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

	