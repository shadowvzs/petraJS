import { build, useState, useEffect } from "@core/VDom";
import { createStyles } from "@core/JSS";

const css = createStyles({
    table: {
        margin: '20px auto',
        minWidth: 700,
        backgroundColor: '#eee',
        '& th': {
            backgroundColor: '#ddd'
        }
    }
});

interface User {
    id: number;
    name: string;
    email: string;
}

interface State {
    id: number;
    user: User;
}

interface UserTableProps {
    initId: number;
}

const UserTable = ({ initId }: UserTableProps): JSX.Element => {

    const [state, setState] = useState<State>({
        id: initId || 0,
        user: {}
    } as State);

    const onPrev = () => {
        if (state.id > 1) { state.id--; }
        loadUser(state.id);
    };
    const onNext = () => {
        if (state.id < 10) { state.id++; }
        loadUser(state.id);
    };
    const loadUser = async (userId) => {
        fetch('https://jsonplaceholder.typicode.com/users/' + userId)
            .then(response => response.json())
            .then((userData: User) => {
                setState({ ...state, user: userData });
            });
    };

    useEffect( () => {
        loadUser(state.id);
    }, []);

    return (
        <div style='text-align:center'>
            <table className={css.table} border="1">
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>email</th>
                </tr>
                <tr>
                    <td>{state.user.id}</td>
                    <td>{state.user.name}</td>
                    <td>{state.user.email}</td>
                </tr>
            </table>
            <button onClick={onPrev}>prev</button>
            <button onClick={onNext}>next</button>
        </div>
    );
}

export default UserTable;
