const http = require('http')
const PORT = 3000
const DEFAULT_HEADER = { 'Content-Type': 'application/json' }

const HeroFactory = require('./factory/heroFactory')
const heroService = HeroFactory.generateInstance()
const Hero = require('./entity/hero')

const routes = {
    '/hero:get': async (request, response) => {
        const { id } = request.queryString
        
        const heroes = await heroService.find(id)
        response.write(JSON.stringify({ result: heroes }))
        response.end()
    },
    'hero:post': async (request, response) => {
        for await ( const data of request) {
            try {
                const item = JSON.parse(data)
                const hero = new Hero(item)
                const { error, valid } = heroService.isValid()
                
                if (!valid) {
                    response.writeHead(400, DEFAULT_HEADER)
                    response.stringify(JSON.stringify({ error: error.join(',') }))
                    response.end()
                }
                const id = await heroService.create(hero)
                response.writeHead(201, DEFAULT_HEADER)
                response.write(JSON.stringify({ success: 'User created with success!', id }))
    
                // Considering a single request per insert, we can let this return here
                // if a single cliend sent one file we need remove this .end()
                response.end()
            } catch(error) {
                return handlerError(response)(error)
            }
        }
    },
    default: (request, respose) => {
        respose.write('Where am I!?')
        respose.end()
    }
}

const handlerError = response => {
    return error => {
        console.error('Error', error)
        response.writeHead(500, DEFAULT_HEADER)
        response.write(JSON.stringify('Internal server error'))
        return response.end()
    }
}

const handler = (request, response) => {
    const { url, method } = request
    const [ first, route, id ] = url.split('/')
    
    request.queryString = { id: isNaN(id) ? id : Number(id) }

    const key = `/${route}:${method.toLowerCase()}`
    
    response.writeHead(200, DEFAULT_HEADER)
    const chosen = routes[key] || routes.default

    return chosen(request, response)
        .catch(handlerError(response))
}

http.createServer(handler)
    .listen(PORT, () => console.log('Server running at', PORT))