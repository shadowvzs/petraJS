import NavMenu from "./NavMenu";
import { build } from "@core/VDom";
import { KeyValuePair } from "@core/types";
import { createStyles } from "@core/JSS";

const css = createStyles({
    box: {
        margin: '16px auto',
        width: 300,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.2)',
        border: '1px dotted rgba(0,0,0,0.5)',
        borderRadius: 16
    }
});

const ArticlePage = (childs: JSX.Element[], props: KeyValuePair<string>): JSX.Element => {
    document.title = `Article Page`;
    console.log(props)
    return (
        <div>
            <NavMenu />
            <div className={css.box}>
                <h3>Props:</h3>
                { Object.entries(props).map(([name, value]) => (
                    <div><b>{name}</b>: {value}</div>
                )) }
            </div>
        </div>
    );
}

export default ArticlePage;
