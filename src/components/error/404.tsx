import React from 'react';

const ComponentError404 = React.memo(() => {
  return (
    <div>
      <h3>Aradiginiz Sayfa Bulunamadi!</h3>
      <a href="/" className="btn btn-gradient-primary">
        <i className="mdi mdi-arrow-left-circle-outline"></i> Anasayfaya Don
      </a>
    </div>
  );
});

export default ComponentError404;
