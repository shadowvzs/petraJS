# Style and classes

You can style a component, multiple way :)

### Quick options:
* **classes:**
   * send jss like param to **createStyles** function and use the classnames from object
   * regular class declaration (**string** or **string[]**)
* **styles:**   
   * inline style with **object**
   * inline style with **string**


## component wrapping with *createStyles*


```typescript
import { build } from "@core/VDom";
import { createStyles, build } from "@core/JSS";

const styles = createStyles({
    youtubeCard: {
        backgroundColor: '#fff',
        position: 'relative',
        display: 'table',
        color: '#000',
        border: '1px solid rgba(0,0,0,0.3)',
        padding: 5,
        margin: '20px 20px',
        boxShadow: '10px 10px 10px rgba(0,0,0,0.5)',
        maxWidth: 330,
        width: '100%',
        minWidth: 100,
    }
});

interface IYoutubeCard {
    count: number;
    url: string;
    title: string;
    thumb: string;
}

const YoutubeCard = ({ classes, count, url, title, thumb }: IYoutubeCard): JSX.Element => {
    return (
        <figure className={styles.youtubeCard}>
    		<a href={url} title={title}>
    			<img src={thumb} alt={title} />
    		    <figcaption>{title} {count ? ' ' + count : ''}</figcaption>
    	    </a>
        </figure>
    );
};
```

## Class and ClassName properties

this should be done with **class** or **className** attributes, but i recommend the **className** because you can use **string array** too

```typescript
const YoutubeCard = ({ count, url, title, thumb }: IYoutubeCard): JSX.Element => {
    return (
        <figure className='youtube-card'>
    		<a href={url} title={title} className={['focusable', 'active']}>
    			<img src={thumb} alt={title} />
    		    <figcaption class='youtube-caption'>{title} {count ? ' ' + count : ''}</figcaption>
    	    </a>
        </figure>
    );
};
```


## Styling with style object


you can use jss, so object which contain the style and vdom with convert the style object into string in background with ***toStyle***.

```typescript
import { build } from "@core/VDom";
import { toStyle } from "@core/JSS";
// if you want make experiment then you can use
// console.log(toStyle({ borderRadus: 4 }));

const Test = (): JSX.Element => {
    const myStyle = { color: 'blue' };
    return (
        <div>
            <div
                style={{ color: 'red', opacity: 0.5, fontSize: 14 }}
                children={'Hello World'}
            />
            <span style={ myStyle } children="Blue text">
        </div>
    );
};
```

## Old way

simple old way

```typescript
import { build } from "@core/VDom";

const Test = (): JSX.Element => {
    return (
        <div>
            <div 
                style='color: red; opacity: 0.5; fontSize: 14px'
                children={'Hello World'}
            />
        </div>
    );
};
```
