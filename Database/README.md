# Database

So this is really just for local/demo purposes. It's a disposable docker container with the sole mission of loading data into mongo and then disappearing.

Once the data is loaded we'll have a two collections - gatherer_cards and scryfall_cards. Because we're local, mongo's running without auth so point your favorite DB viewer like [robo3t](https://robomongo.org/) at http://localhost:27017 and poke around.
