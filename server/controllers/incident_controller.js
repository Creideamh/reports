const incident = require('./../model/incidents');


// add incident 
exports.create = (req, res) => {

    if (!req.body) {
        req.success.message = {
            type: 'danger',
            message: 'All fields are required'
        };
        res.redirect('/incidents');
    }

    // Insert into database 
    const inc = new  incident({
        employee_id: req.body.employee_id,
        short_description: req.body.short_description,
        description: req.body.description,
        status: req.body.status,
        incident_date: req.body.incident_date,
        user_id: req.body.user_id
    });


    
    inc.save(inc).then((data) => {
        console.log(data);
        if(!data){
            req.session.message ={
                type: 'danger',
                message: 'All fields are required'
            };
            res.redirect('/incidents/add');
        }

        req.session.message = {
            type: "success",
            message: `Incident created`,
        };
        res.redirect('/incidents');

    }).catch((err) => {

        req.session.message = {
            type: 'danger',
            message: `System error encountered with error ${err}`
        };
        res.redirect('/incidents/add');
        
    });

};