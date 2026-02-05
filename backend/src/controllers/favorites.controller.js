const Favorite = require('../models/favorites.model.js');
const Event = require('../models/event.model.js');
const User = require('../models/user.model.js')

exports.addFavorites = async (req, res) => {
    try{
        const user_id = req.user.id;
        const { event_id, title, url, start_time, venue, description, pii_score, where, source, category } = req.body;

        if(!event_id || !title || !source ){
            return res.status(400).json({error: "Missing event data."});
        }

        //check if event exists
        let eventExists = await Event.findByPk(event_id);
        if(!eventExists){
            console.log("Event not found. Creating in cache...");
            eventExists = await Event.create({
                id: event_id,
                title: title || "Untitled Event",
                url: url || null,
                start_time: start_time || null,
                venue: venue || null,
                location: where || null,
                category: category || "Unknown",
                description: description || null,
                pii_score: pii_score || null,
                source: source || null
            });
        }

        const [favorite, created] = await Favorite.findOrCreate({
            where: { user_id, event_id },
            defaults: { 
                user_id,
                event_id,
                event_title: title,
                source: source,
            }
        });

        if (!created){
            return res.status(200).json({message:"Event already in favorites"})
        }

        return res.status(201).json({message:"Event added to favorites"});
    }catch(error){
        console.log("Add favorites error: ", error.message);
        res.status(500).json({ error: "Failed to add favorite."});
    }
};

exports.getFavorites = async (req, res) => {
    try{
        const user_id = req.user.id;

        const usernm = await User.findOne({
            where: { id: user_id }
        })

        const favorites = await Favorite.findAll({
            where: { user_id }
        });
        
        res.json({ 
            user: {
                user_id: usernm.id,
                username: usernm.username    
            },
            count: favorites.length,
            favorites
        });

    }catch(error){
        console.error("Get favorites error: ", error.message);
        res.status(500).json({ error: "Failed to fecth favorites."});
    }
};

exports.removeFavorites = async ( req, res ) => {
    try{
        const user_id = req.user.id;
        const { title } = req.params;//like this because the event_id is in the url path

        const event = await Event.findOne({ where: { title } });
        if (!event) return res.status(404).json({ error: "Event not found" });

        const deleted = await Favorite.destroy({
            where: { user_id, event_id: event.id },
        })

        if( deleted === 0 ){
            res.status(404).json({ error: "Favorite not found"});
        }
        res.json({ message: "Event removed from favorites."});
    }catch(error){
        console.error("Remove favorite error: ", error.message);
        res.status(500).json({error: "Failed to remove favorite."});
    }
};