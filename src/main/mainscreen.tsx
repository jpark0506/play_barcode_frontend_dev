import Nav from '../common/components/nav/nav';
import InfoComponent from './components/info/infocomponent';
import Search from './components/search/search';
import KakaoModal from '../login/Modal';
import CustomToast from '../common/components/toast/customtoast';
type Props = {}

const MainScreen = (props: Props) => {

    return (
        <div className="flex flex-col justify-center w-full h-full bg-system-background">
            <div className='flex flex-col min-h-screen justify-start bg-system-background p-4'>
                <KakaoModal/>
                <Nav/>
                <InfoComponent/>
                <Search/>
                <CustomToast/>
            </div>
        </div>
    )
}

export default MainScreen