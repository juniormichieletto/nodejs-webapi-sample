const HeroRepository = require('./../repository/heroRepository')
const HeroService = require('./../service/heroService')

const { join } = require('path')
const fileName = join(__dirname, '../../database', 'data.json')

const generateInstance = () => {
    const heroRepository = new HeroRepository({ file: fileName })
    const heroService = new HeroService({ heroRepository })

    return heroService
}

module.exports = { generateInstance }

// generateInstance().find().then(console.log).catch(error => console.log(error))
