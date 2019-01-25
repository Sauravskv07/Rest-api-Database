const express= require('express');
const logger=require('morgan');
const bodyParser=require('body-parser');
const errorhandler=require('errorhandler');
const MongoClient = require('mongodb').MongoClient;

const url='mongodb://localhost:27017/nalanda';
const app=express();
app.use(logger('dev'));
app.use(bodyParser.json());


MongoClient.connect(url,{ useNewUrlParser: true }, (error, client)=>
	{
	if(error) 
	{
		console.log('there has been an error while connecting');
		return process.exit(1);
	}
	app.get('/:studId/dashboard',(req,res)=>
		{
		const db=client.db('Courses_registered');
		const collection=db.collection((req.params.studId).toString('utf8'));
		collection.find({}, {sort: {_id: -1}}).toArray((error, result) => 
			{
        		if (error) return next(error)
        		res.send(result)
    			});
		});
	app.post('/:studId/dashboard',(req,res)=>
		{
		const db=client.db('Courses_registered');
		const collection=db.collection(req.params.studId);
		collection.insertOne(req.body,(error,result)=>
			{
			if(error) return next(error);
			res.send(result);			
			});
		});
	app.put('/:studId/dashboard/:CourseCode',(req,res)=>
		{
		const db=client.db('Courses_registered');
		const collection=db.collection((req.params.studId).toString('utf8'));
		const CourseCode=req.params.CourseCode;
		collection.update({CourseCode:CourseCode},{$set: req.body},(error, result) =>
			{
         		if (error) return next(error);
         		res.send(result);
       			});
		});
	app.delete('/:studId/dashboard/:CourseCode',(req,res)=>
		{
		const db=client.db('Courses_registered');
		const collection=db.collection((req.params.studId).toString('utf8'));
		const CourseCode=req.params.CourseCode;
		collection.deleteOne({CourseCode:CourseCode},(error,result)=>
			{
			if(error) return next(error);
			res.sent(result);
			});
		});
	app.listen(3000);

	});


