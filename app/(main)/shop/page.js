'use client'
import { CourseCard } from "@/components/shop/course-card";
import { ShopHeader } from "@/components/shop/shop-header";

const shopPage =  () => {
    return (
            <div className="py-5">
                <div className="flex items-center justify-center mb-4">
                    <ShopHeader />
                </div>
                <div className="flex flex-wrap gap-10 p-6 items-center justify-center">

                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />
                    <CourseCard title={"Title"} imgUrl={"/images/background.jpg"} description={"This is some detail text about the card. It can include brief information or a description"} />


                </div>

            </div>
    )
}

export default shopPage;
