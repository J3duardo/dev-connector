const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");
const {check, validationResult} = require("express-validator");
const request = require("request");

//Leer perfil del usuario actual
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id}).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({
        msg: "Theres no profile for that user"
      })
    }

    res.json(profile);

  } catch(error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Crear perfil de usuario
router.post("/", [auth, [
  check("status", "Status is required").not().isEmpty(),
  check("skills", "Skills is required").not().isEmpty()
]], async (req, res) => {
  try {
    //Chequear si hay errores de validación
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()})
    }

    //Extraer los datos del usuario del request
    const {company, website, location, bio, status, githubUsername, skills, youtube, facebook, twitter, linkedin, instagram} = req.body;

    //Crear data del perfil
    const profileFields = {};
    profileFields.user = req.user.id;

    //Chequear si existen los datos del perfil en el request
    company ? profileFields.company = company : null;
    website ? profileFields.website = website : null;
    location ? profileFields.location = location : null;
    bio ? profileFields.bio = bio : null;
    status ? profileFields.status = status : null;
    githubUsername ? profileFields.githubUsername = githubUsername : null;

    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim())
    }

    profileFields.social = {};
    youtube ? profileFields.social.youtube = youtube : null;
    facebook ? profileFields.social.facebook = facebook : null;
    twitter ? profileFields.social.twitter = twitter : null;
    linkedin ? profileFields.social.linkedin = linkedin : null;
    instagram ? profileFields.social.instagram = instagram : null;
    
    //Chequear si el perfil existe en la base de datos
    let profile = await Profile.findOne({user: req.user.id});

    //Si existe, actualizarlo
    if(profile) {
      profile = await Profile.findOneAndUpdate(
        {user: req.user.id},
        {$set: profileFields},
        {new: true}
      );
      return res.json(profile)
    }

    //Si no existe el perfil, crearlo
    profile = await Profile.create(profileFields);
    return res.json(profile);

  } catch(error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Obtener todos los perfiles de los usuarios
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);

  } catch(error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Obtener el perfil de un usuario
router.get("/user/:userId", async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.params.userId}).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({
        msg: "No profile for that user"
      })
    }
    res.json(profile);

  } catch(error) {
    console.error(error.message);
    //Mensaje de error cuando la id no corresponde con el formato de las ids de la base de datos
    if(error.kind === "ObjectId") {
      return res.status(404).json({
        msg: "No profile for that user"
      })
    }
    res.status(500).send("Server error")
  }
});

//Borrar perfil, cuenta y posts de un usuario
router.delete("/", auth, async (req, res) => {
  try {
    //Borrar los posts del usuario
    await Post.deleteMany({user: req.user.id});

    //Borrar el perfil del usuario
    await Profile.findOneAndRemove({user: req.user.id});

    //Borrar el usuario
    await User.findOneAndRemove({_id: req.user.id});

    res.json({msg: "User deleted from database"});

  } catch(error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Agregar experiencia al perfil del usuario
router.patch("/experience", [auth, [
  check("title", "Title is required").not().isEmpty(),
  check("company", "Company is required").not().isEmpty(),
  check("from", "From date is required").not().isEmpty(),
]], async (req, res) => {
  //Chequear si la data ingresada es válida
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  //Extraer la data ingresada en el formulario
  const {title, company, location, from, to, current, description} = req.body;
  const newExperience = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.experience.unshift(newExperience);
    await profile.save();

    res.status(200).json(profile);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Borrar experiencia del perfil de usuario
router.delete("/experience/:expId", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removedIndex = profile.experience.map(el => {
      return el.id
    }).indexOf(req.params.expId);

    profile.experience.splice(removedIndex, 1);
    await profile.save();
    res.json(profile);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Agregar education al perfil del usuario
router.patch("/education", [auth, [
  check("school", "School is required").not().isEmpty(),
  check("degree", "Degree is required").not().isEmpty(),
  check("fieldOfStudy", "The field of study is required").not().isEmpty(),
  check("from", "The 'From' date of study is required").not().isEmpty(),
]], async (req, res) => {
  //Chequear si la data ingresada es válida
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  //Extraer la data ingresada en el formulario
  const {school, degree, fieldOfStudy, from, to, current, description} = req.body;
  const newEducation = {
    school,
    degree,
    fieldOfStudy,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({user: req.user.id});
    profile.education.unshift(newEducation);
    await profile.save();

    res.status(200).json(profile);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Borrar education del perfil de usuario
router.delete("/education/:educationId", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({user: req.user.id});
    const removedIndex = profile.education.map(el => {
      return el.id
    }).indexOf(req.params.educationId);

    profile.education.splice(removedIndex, 1);
    await profile.save();
    res.json(profile);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error")
  }
});

//Tomar los repositorios de la cuenta de github
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${req.params.username}/repos?per_page=10&sort=created:asc&client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`,
      method: "GET",
      headers: {"user-agent": "node.js"}
    }

    request(options, (error, response, body) => {
      if (error) {
        console.error(error)
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({
          msg: "Github profile not found"
        })
      }
      res.json(JSON.parse(body));
      return
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error")
  }
})

module.exports = router;