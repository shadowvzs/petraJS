# Form and class validation

![Class Validator](http://shadowvzs.uw.hu/share/cv.gif)


Form and class validator is make easier and faster the new form creation and data handling because validator running before form submited and if everything valid then call your **onSubmit** handler function and pass all form data into your handler function;

### Quick options:
* Form elements:
   * Form
   * Input
   * Textarea
   * Select
* Validation option: 
   * separated object 
   * decorator style

<details>
<summary>
[Form and form element interfaces (click to show more)]
</summary>

```typescript
interface IFormProps<T> {
    onSubmit: (arg0: any) => any;
    children?: IVDOM.Children | IVDOM.Children[];
    className?: string;
    model: IModel<T>;
    style?: KeyValuePair<any>;
}

interface IInput<T> {
    // common props
    inputProp?: KeyValuePair<any>;
    className?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'radio' | 'checkbox' | 'submit' | 'textarea' | 'select';
    name?: keyof T;
    model?: IModel<T>;
    placeholder?: string;
    errorHelper?: IErrorHelper;
    // optional props
    value?: string;
    style?: string;
    // input props
    autocomplete?: 'on' | 'off';
    autofocus?: boolean;    
    // select based props
    nonEmpty?: boolean;
    options?: [string, string][];
    // textarea based props
    cols?: string;
    rows?: string;
}
```
</details>

----------------

### Demonstration
**1)** let say we have a basic login form, only with email and password, so first we create a ***model*** (object which extend the ***Base*** object) with decorator validation *(Option 1)* or with separated validation object *(Option 2)* like below.


### Option 1:
#### User.ts
```typescript
import BaseModel, { CV } from "@core/model/Base";

export type ILoginUser = {
    email: string;
    password: string;    
};

export class LoginUser extends BaseModel<ILoginUser> implements ILoginUser {
    @CV('TYPE.EMAIL', 'Wrong email address')
    public email: string;

    @CV('TYPE.STR_AND_NUM', 'Password must be alpha-numeric')
    @CV('LENGTH.MIN_MAX', 'Password must be between 6-32 character', [6, 32])
    public password: string;
}
```

### Option 2:

#### User.ts
```typescript
import BaseModel, { addValidation, IValidation } from "@core/model/Base";

export type ILoginUser = {
    email: string;
    password: string;    
};

const myValidation = {
    email: [
        addValidation('TYPE.EMAIL', 'Wrong email address')
    ],
    password: [
        addValidation('TYPE.STR_AND_NUM', 'Password must be alpha-numeric'),
        addValidation('LENGTH.MIN_MAX', 'Password must be between 6-32 character', [6, 32]),
    ],
    pali: [
        addValidation('REQUIRED', 'Pali hianyzik'),
    ]
} as  IValidation<ILoginUser>;

export class LoginUser extends BaseModel<ILoginUser> implements ILoginUser {
    public $validation = myValidation;
    public email: string;
    public password: string;
}
```

<details>
<summary>
[if you want add custom validation or check the default ones (click to show more)]
</summary>

### custom validation

```typescript
interface IRegistrationUserData {
    username: string;
    password1: string;
    password2: string;
}
const myValidation = {
    password2: [
        (value: string, model?: IRegistrationUserData) => value !== model.password1 && ({
            type: 'CUSTOM',
            message: 'The 2 password not match'
        });
    ]
}
```

### Default validators (this should be extended and changed by time)
```typescript
export const validator: IValidatorData = {
    TYPE: {
        EMAIL: (x: string) => new RegExp('^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$)$').test(x),
        NAME: (x: string) => new RegExp('^([a-zA-Z0-9 \-]+)$').test(x),
        INTEGER: (x: string) => new RegExp('^([0-9]+)$').test(x),
        SLUG: (x: string) => new RegExp('^[a-zA-Z0-9-_]+$').test(x),
        URL: (x: string) => new RegExp('^[a-zA-Z0-9-_]+$').test(x),
        ALPHA_NUM: (x: string) => new RegExp('^([a-zA-Z0-9]+)$').test(x),
        STR_AND_NUM: (x: string) => new RegExp('^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$').test(x),
        LOWER_UPPER_NUM: (x: string) => new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$').test(x),
        MYSQL_DATE: (x: string) => new RegExp('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$').test(x),
        JSON: (x: string) => {
            try {
                JSON.parse(x);
            } catch(err) {
                return false;
            }
            return true;
        },
    },
    LENGTH: {
        MIN: (x: string, len1: number) => Boolean(x && x.length >= len1),
        MAX: (x: string, len1: number) => Boolean(x && x.length <= len1),
        MIN_MAX: (x: string, len1: number, len2?: number) => Boolean(x && x.length >= len1 && len2 && x.length <= len2)
    },
    REQUIRED: (x: string, o?: any) => Boolean(x),
    MATCH: (x: string, y: string) => x === y,
    COMPARE: (x: string, y: string, o?: any) => Boolean(y && x === o[y]),
}
```
</details>

-----------------------------
**2)** Then anywhere we should import the form elements, our model and our handler *(our case **auth.login()** method)*

We initiate our model object then create our functional component, and use our form elements, but most important things are the followings: 
 * onSubmit and model on **Form** element
 * name and type if needed on form elements like **Input**

#### Anything.tsx
```typescript
import Form, { Input } from '@core/Form';
import { LoginUser } = '@model/User';
import { auth } = '@service/Auth';

interface IProps {
    // some prop if we you want
    // then you shoudl use this way <LoginForm onSubmit={console.log} email={'valami@valami.val'} />
}

const LoginForm = (props: IProps) => {
    const inputProps = {
        className: 'my-input'
    };
    const model = new LoginUser();
    // const model = new LoginUser({ email: 'predefined email from prop' });
    // the helperText if setted then we have error message below the input else we have error only before submit
    return (
        <Form className="my form" onSubmit={auth.login} model={model} helperText={true}>
            <h1 className="form-title">Login form</h1>
            <Input name="email" placeholder="Email address" />
            <Input name="password" type="password" placeholder="Password" />
            <Input type="submit" value="Login" inputProp={inputProps} />
        </Form>
    );
}

```