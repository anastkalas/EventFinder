const Favorite = require('../models/favorites.model.js');
const Events = require('../models/event.model.js');
const { Sequelize } = require('sequelize');

exports.getPreferencesFromFav = async (req, res) => {
    try{
        const user_id = req.user.id;



        const preferences = await Favorite.findAll({
            where: { user_id },
            include: [
                {
                    model: Events,
                    attributes: ["category"],
                },
            ],
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('Event.category')), 'category'],
            ],
            raw: true,
        });

        console.log("hgsdfiohgierfvdkf");
        res.json({ count: preferences.length, preferences });
    }catch(err){
        console.error("Get Preferences error: ", err.message);
        res.status(500).json({ error: "Failed to fetch Preferences."});
    }
};