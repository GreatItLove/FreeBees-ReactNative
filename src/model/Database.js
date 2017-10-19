import * as firebase from "firebase";

class Database {
    static uploadItem(image, description, title, lat, lng, condit ) {
        const sessionId = new Date().getTime()
        let uploadPath = "/posts/addPost/" + sessionId;
        return firebase.database().ref(uploadPath).set({
            image: image,
            condit: condit,
            title: title,
            description: description,
            lat: lat,
            lng: lng
        })
    }
}

module.exports = Database;