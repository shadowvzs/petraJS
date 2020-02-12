# petraJS
Minimalistic micro JS framework

![alt text](http://shadowvzs.uw.hu/images/petrajs.png "PetraJS the minimalistic & independent framework")

### Last sneak peak
```typescript
import { build, useState, useEffect } from "@core/VDom";
import { createStyles } from "@core/JSS";

const css = createStyles({
    table: {
        margin: '20px auto',
        backgroundColor: '#eee'
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
            <table className={css.table}>
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
```


### Feature
* router (incl. nested routes)
* virtual dom
    * hooks: useState (limited to 1 per function), useEffect, useRef
    * whole tree rendering (pageRender / update / mount)
    * subtree updating (updateSubtree)
    * replacing existing tree (mount)
    * added lifecycles: mount / update / unmount **(deprecated)** - !!! new way: useRef !!!
    * added svg support
    * added childAttrs prop (prop propagation for sub comp)
    * form and form elements
    * class validation for form elements
    * jss styles & classnames (**createStyles**)
    * file explorer (add folder/upload file/navigate in tree)
* few basic service:
    * request (xhr/ajax)
    * crud (send crud request to backend)
    * notify (create notification temporary messages)
    * panel (create modal or windows)

### Documentation:
* [How to use Form with class validator](https://github.com/shadowvzs/petraJS/tree/master/project/wiki/form.md)
* [How to use Css classes and styles](https://github.com/shadowvzs/petraJS/tree/master/project/wiki/style.md)


### Last update:
* changed the updateSubtree
* added hooks (similiar like in reactJS: useState, useEffect, useRef)
* removed loader and lifecycle (new way is the hooks)
* added treeview and breadcrumb for File Explorer
* added JSS support (work with nested JSS too)
* fixed the undefined value prop issue
* added svg support
* added form and form elements
* added class validator

### Requirement:
* Webpack
* Babel
* Typescript
* Apache2 & enabled url rewrite module

### Structure
    * core folder - framework itself
        * **service**
        * **types**
        * index files

### Description
* many other thing will comming soon :)

[![Nested routes](https://img.youtube.com/vi/wQ3fWnJ3C70/0.jpg)](https://www.youtube.com/watch?v=wQ3fWnJ3C70)
