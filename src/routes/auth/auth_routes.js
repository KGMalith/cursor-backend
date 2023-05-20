const router = require('express').Router();
//router controllers 
const userController = require('../../controllers/auth/auth_controller');
const validationsMiddleware = require('../../middlewares/validators/common_validator');
const authRoutesValidationsSchemas = require('../../middlewares/validators/validation_schemas/auth_validation_schema');
const { checkToken } = require('../../middlewares/auth/token_validation');

router.post('/signup',
	validationsMiddleware(authRoutesValidationsSchemas.signUp),
	userController.userSignUp
);

router.post('/signin',
	validationsMiddleware(authRoutesValidationsSchemas.signIn),
	userController.userSignIn
);

//presigned url for profile image
router.post('/upload-profile-image',
	checkToken,
	validationsMiddleware(authRoutesValidationsSchemas.uploadProfileImage),
	userController.getPreSignedUrlToUploadProfileImage
);

//update user profile
router.post('/update-user-profile',
	checkToken,
	validationsMiddleware(authRoutesValidationsSchemas.updateUserProfile),
	userController.updateUserProfile
);

//update user passwords
router.post('/update-password',
	checkToken,
	validationsMiddleware(authRoutesValidationsSchemas.updateUserPassword),
	userController.updateUserPassword
);


module.exports = router;