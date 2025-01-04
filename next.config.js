/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_PROTOCOL: process.env.API_PROTOCOL,
        API_HOST: process.env.API_HOST,
        ...(process.env.API_PORT ? {API_PORT: process.env.API_PORT} : {}),
        UPLOAD_FILE_SIZE: process.env.UPLOAD_FILE_SIZE,
        runType: process.env.runType,
        SASS_WARN_DEPRECATION: process.env.SASS_WARN_DEPRECATION,
    },
    reactStrictMode: false,
    swcMinify: true,
    images: {
        //unoptimized: true,
        remotePatterns: [
            {
                protocol: process.env.API_PROTOCOL,
                hostname: process.env.API_HOST,
                ...(process.env.API_PORT ? {port: process.env.API_PORT} : {}),
                pathname: "/uploads/**"
            },
        ],
    },
    async rewrites() { 
        return [
            /* Theme Content */
            {
                source: "/theme-content/:path*",
                destination: "/:path*"
            },
            /* E Commerce */
            {
                source: "/e-commerce/product/:path*",
                destination: "/post/:path*"
            },
            /* Component */
            {
                source: "/component/edit/:_id",
                destination: "/component/add"
            },
            /* Language */
            {
                source: "/language/edit/:_id",
                destination: "/language/add"
            },
            /* Navigation */
            {
                source: "/navigation/edit/:_id",
                destination: "/navigation/add"
            },
            /* Post */
            {
                source: "/post/:postTypeId/add",
                destination: "/post/add"
            },
            {
                source: "/post/:postTypeId/list",
                destination: "/post/list"
            },
            {
                source: "/post/:postTypeId/edit/:_id",
                destination: "/post/add"
            },
            /* Post Term */
            {
                source: "/post/:postTypeId/term/:termTypeId/add",
                destination: "/post/term/add"
            },
            {
                source: "/post/:postTypeId/term/:termTypeId/list",
                destination: "/post/term/list"
            },
            {
                source: "/post/:postTypeId/term/:termTypeId/edit/:_id",
                destination: "/post/term/add"
            },
            /* User */
            {
                source: "/user/edit/:_id",
                destination: "/user/add"
            }
        ]
    }
}

module.exports = nextConfig