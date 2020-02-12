import NavMenu from "./NavMenu";
import UserTable from "./UserTable";
import { build } from "@core/VDom";

const HomePage = (): JSX.Element => {
    document.title = `Home Page`;
    return (
        <div>
            <NavMenu />
            <UserTable initId={1} />
        </div>
    );
}

export default HomePage;
