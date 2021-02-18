import './GenderHeader.css';

const GenderHeader = ( {data} ) => {
    const {gender} = data;
    let gndr;
    if(gender === 'men'){
        gndr = 'MN';
    } else if ( gender === 'women') {
        gndr = 'WMN';
    };

    let text;

    if(data.category_title === undefined){
        text = <h1>PRDCTS FR {gndr}</h1>
    } else {
        text = <h1>{data.category_title} FR {gndr}</h1>
    }
    
    return(
        <div>
            {text}
        </div>
    );
};

export default GenderHeader; 