/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', "videoplayer-check-public.s3.ap-southeast-2.amazonaws.com", "localhost", "https://treasure-map-academy.vercel.app"], // Add the external domain here
    },
    reactStrictMode : false,
};

export default nextConfig;
