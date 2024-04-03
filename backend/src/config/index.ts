import { config } from 'dotenv'
import { resolve as Resolve } from 'path'


export const Config = () => {
    const env = process.env.NODE_ENV
    if (env) {
        const pathToEnvFile = Resolve(__dirname, `./${env}.env`)
        config({ path: pathToEnvFile })
        console.log(`:: YOU ARE ON \x1b[36m${env?.toUpperCase()} MODE\x1b[0m ::`)
        return true
    } else {
        console.log(
            'An error occurred during Env configuration or initialization:'
        )
        return false
    }
}
