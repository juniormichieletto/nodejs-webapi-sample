class Hero {
    constructor({ id, name, age, power }) {
        this.id = Math.floor(Math.random() * 100) + Date.now()
        this.name = name
        this.age = age
        this.power = power
    }

    isValid() {
        const properyNames = Object.getOwnPropertyNames(this)
        const amountInvalid = properyNames
            .map(property => (!!this[property]) ? null : `${property} is missing`)
            .filter(item => !!item)

        return {
            valid: amountInvalid === 0,
            error: amountInvalid
        }
    }
}

module.exports = Hero