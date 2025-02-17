/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', "videoplayer-check-public.s3.ap-southeast-2.amazonaws.com"], // Add the external domain here
    },
    reactStrictMode : false,
};

export default nextConfig;
