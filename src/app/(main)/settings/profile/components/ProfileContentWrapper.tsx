import dynamic from "next/dynamic";
import { GetResponseType } from "../action";

const ProfileContentComponent = dynamic(() => import('./ProfileContent'), {
    loading: () => (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                ))}
            </div>
        </div>
    )
});

interface ProfileContentWrapperProps {
    userData: GetResponseType;
}

export default function ProfileContentWrapper({ userData }: ProfileContentWrapperProps) {
    return <ProfileContentComponent userData={userData} />;
}
