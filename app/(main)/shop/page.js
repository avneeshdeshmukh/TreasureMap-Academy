'use client'
import { ShopHeader } from "@/components/shop/shop-header";
import  EnrolledCourses  from "@/components/shop/enrolledCourses"
import NewCourses from "@/components/shop/newCourses";
const shopPage =  () => {
    
    return (
            <div className="">
                <div className="flex items-center justify-center">
                    <ShopHeader />
                </div>
                <div className="flex">
                    <EnrolledCourses/>
                </div>
                <div className="flex">
                    <NewCourses/>
                </div>

            </div>
    )
}

export default shopPage;
