import { FeedWrapper } from "@/components/feed-wrapper";
import { Header } from './header'
import YourCourses  from '@/components/creatorDashboard/yourcourses'
import CreatorStats from '@/components/creatorDashboard/creatorStats'
import FeaturedCourses from "@/components/creatorDashboard/featuredcourses";
import Notifications from '@/components/creatorDashboard/notifications'
const creatordashboard = () => {
    return(
        <FeedWrapper>
                <Header title={"Welcome Creator!"} />
                <YourCourses/>
                <CreatorStats/> 
                <FeaturedCourses />
                <Notifications/>
        </FeedWrapper>
    )
}
export default creatordashboard;