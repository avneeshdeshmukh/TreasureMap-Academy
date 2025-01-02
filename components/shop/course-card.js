import Image from 'next/image';
import { Button } from '../ui/button';

export const CourseCard = ({ title, imgUrl, description }) => {
    return (
        <div className="flex flex-col border rounded-lg shadow-lg bg-[#2c3748] w-full sm:w-1/2 md:w-1/4">
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-200 ">{title}</h2>
            </div>
            <div className="relative w-full h-40">
                <Image
                    src={imgUrl}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="p-4"
                />
            </div>

            <div className="p-4 border-t">
                <p className="text-sm text-gray-300">{description}</p>
            </div>
            <div className="p-4 border-t text-center">
                <Button
                    variant='ghost'
                    className="w-full"
                >Details
                </Button>
            </div>
        </div>
    );
}