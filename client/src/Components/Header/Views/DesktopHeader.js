import '../Header.css';
import React from 'react';
import { Link } from 'react-router-dom';

const DesktopHeader = ({ categoryListM, categoryListW, brands, actions }) => {
    return (
        <div data-testid='desktop-header' className="selection" >
            <nav className='desktop-nav' >
                <div className="dropdown" >
                    <p><Link to={'/products/men'} >MN</Link></p>
                    <div className="dropdown-content">
                        {categoryListM}
                    </div>
                </div>
                <div className="dropdown" >
                    <p><Link to={'/products/women'} >WMN</Link></p>
                    <div className="dropdown-content">
                        {categoryListW}
                    </div>
                </div>
                <div className="dropdown" >
                    <p>BRNDS</p>
                    <div className="brands-drop">
                        {brands}
                    </div>
                </div>
            </nav>
            {actions}
        </div>
    );
};

export default DesktopHeader;