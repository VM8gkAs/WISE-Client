/*
 * This is a box2dModel step object that developers can use to create new
 * step types.
 * 
 * TODO: Copy this file and rename it to
 * 
 * <new step type>.js
 * e.g. for example if you are creating a quiz step it would look
 * something like quiz.js
 *
 * and then put the new file into the new folder
 * you created for your new step type
 *
 * your new folder will look something like
 * vlewrapper/WebContent/vle/node/<new step type>/
 *
 * e.g. for example if you are creating a quiz step it would look something like
 * vlewrapper/WebContent/vle/node/quiz/
 * 
 * 
 * TODO: in this file, change all occurrences of the word 'Box2dModel' to the
 * name of your new step type
 * 
 * <new step type>
 * e.g. for example if you are creating a quiz step it would look
 * something like Quiz
 */

/**
 * This is the constructor for the object that will perform the logic for
 * the step when the students work on it. An instance of this object will
 * be created in the .html for this step (look at box2dModel.html)
 * 
 * TODO: rename Box2dModel
 * 
 * @constructor
 */
function Box2dModel(node) {
	this.node = node;
	this.view = node.view;
	this.content = node.getContent().getContentJSON();
	if(node.studentWork != null) {
		this.states = node.studentWork;
	} else {
		this.states = [];  
	};
	var d = new Date();
	this.timestamp = d.getTime();

};

/**
 * Find the previous models for all the steps that have the given tag and occur
 * before the current step in the project
 * @param tagName the tag name
 * @param functionArgs the arguments to this function
 * @returns the results from the check, the result object
 * contains an array of previous saved models
 */
Box2dModel.prototype.checkPreviousModelsForTags = function(tagName, functionArgs) {
	//default values for the result
	var result = {
		"previousModels":[]
	};
	
	if (typeof this.view.getProject != "undefined")
	{
		//the node ids of the steps that come before the current step and have the given tag
		var nodeIds = this.view.getProject().getPreviousNodeIdsByTag(tagName, this.node.id);
		if(nodeIds != null) {
			//loop through all the node ids that come before the current step and have the given tag
			for(var x=0; x<nodeIds.length; x++) {
				//get a node id
				var nodeId = nodeIds[x];
				
				if(nodeId != null) {
					//get the latest work for the node
					var latestWork = this.view.getState().getLatestWorkByNodeId(nodeId);
					//console.log(latestWork, latestWork.modelData.savedModels, result.previousModels,  result.previousModels.concat(latestWork.modelData.savedModels))
					if (typeof latestWork.modelData !== "undefined"){
						result.previousModels = result.previousModels.concat(latestWork.modelData.savedModels);
						result.custom_objects_made_count = latestWork.modelData.custom_objects_made_count;
					}
				}
			}
		}		
	}
	return result;
};

/**
 * Find a value from a table
 * before the current step in the project
 * @param tagName the tag name
 * @param functionArgs the arguments to this function
 * @returns the results from the check, the result object
 * contains an array of previous saved models
 */
Box2dModel.prototype.checkTableForValue = function(tagName, functionArgs) {
	//default values for the result
	var result = -1;
	
	if (typeof this.view.getProject != "undefined")
	{
		//the node ids of the steps that come before the current step and have the given tag
		var nodeIds = this.view.getProject().getPreviousNodeIdsByTag(tagName, this.node.id);
		if(nodeIds != null) {
			//loop through all the node ids that come before the current step and have the given tag
			for(var x=0; x<nodeIds.length; x++) {
				//get a node id
				var nodeId = nodeIds[x];
				
				if(nodeId != null) {
					//get the latest work for the node
					var latestWork = this.view.getState().getLatestWorkByNodeId(nodeId);
					if (latestWork != null && latestWork != "" && typeof functionArgs != "undefined" && !isNaN(Number(functionArgs[0])) && !isNaN(Number(functionArgs[1]))){
						var text = latestWork.tableData[Number(functionArgs[0])][Number(functionArgs[1])].text;
						if (!isNaN(Number(text))) result = Number(text);
					}
				}
			}
		}		
	}
	return result;
};


/**
 * This function renders everything the student sees when they visit the step.
 * This includes setting up the html ui elements as well as reloading any
 * previous work the student has submitted when they previously worked on this
 * step, if any.
 * 
 * TODO: rename Box2dModel
 * 
 * note: you do not have to use 'promptDiv' or 'studentResponseTextArea', they
 * are just provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at box2dModel.html).
 */
Box2dModel.prototype.render = function() {
	//display any prompts to the student
	$('#promptDiv').html(this.content.prompt);
	//display the prompt2 which is below the canvas and the student textarea
	if (this.content.prompt2 != null && this.content.prompt2.length > 0){
		$('#prompt2Div').html(this.content.prompt2);
	} else {
		// no content to add, remove the div.
		$("#response-holder").remove();
	}

	var previousModels = [];
	var custom_objects_made_count = 0;
	var density = -2;
	// store details of liquids that were tested for mass, volume
	this.liquids_tested = [];

	//process the tag maps if we are not in authoring mode
	if(typeof this.view.authoringMode === "undefined" || this.view.authoringMode == null || !this.view.authoringMode) {
		var tagMapResults = this.processTagMaps();
		//get the result values
		if (typeof tagMapResults.previousModels !== "undefined") previousModels = tagMapResults.previousModels;
		if (typeof tagMapResults.custom_objects_made_count !== "undefined") custom_objects_made_count = tagMapResults.custom_objects_made_count;
		if (typeof tagMapResults.density !== "undefined") density = tagMapResults.density;		
	}

	//load any previous responses the student submitted for this step
	var latestState = this.getLatestState();
	
	if(latestState != null) {
		/*
		 * get the response from the latest state. the response variable is
		 * just provided as an example. you may use whatever variables you
		 * would like from the state object (look at box2dModelState.js)
		 */
		var tableData = latestState.tableData.slice();
		var latestModels = latestState.modelData;
		if (latestModels != null && latestModels != '' && typeof latestModels != "undefined"){
		 	previousModels = latestModels.savedModels.concat(previousModels);
		 	// remove any models with a repeat id
		 	var model_ids = [];
		 	for (var i = previousModels.length-1; i >= 0; i--){
		 		var match_found = false;
		 		for (var j = 0; j < model_ids.length; j++){
		 			if (model_ids[j] == previousModels[i].id){
		 				previousModels.splice(i, 1);
		 				match_found = true;
		 				break;
		 			}
		 		}
		 		if (!match_found) model_ids.push(previousModels[i].id);
		 	}
		 	custom_objects_made_count = Math.max(custom_objects_made_count, latestModels.custom_objects_made_count);
		 }
		
		//set the previous student work into the text area
		$('#studentResponseTextArea').val(latestState.response);
	}

	// setup the event logger and feedbacker
	if (typeof this.content.feedbackEvents != "undefined"){
		this.feedbackManager =  new FeedbackManager(this.node, this.content.feedbackEvents, this.node.customEventTypes) ;
	} else {
		this.feedbackManager =  new FeedbackManager(this.node, [], this.node.customEventTypes) ;
		this.node.setCompleted();
	}

	if (typeof tester == "undefined" || tester == null){ // if we are already in this step, the following is unnecessary
		init(box2dModel.content, previousModels, density >= 0 ? density : undefined, tableData, custom_objects_made_count);
	}
	//eventManager.fire("box2dInit", [{}], this);
	//this.view.pushStudentWork(this.node.id, {});
};

/**
 * Process the tag maps and obtain the results
 * @return an object containing the results from processing the
 * tag maps. the object contains two fields
 * enableStep
 * message
 */
Box2dModel.prototype.processTagMaps = function() {
	
	var previousModels = [];
	var custom_objects_made_count = 0;
	//the tag maps
	var tagMaps = this.node.tagMaps;
	//check if there are any tag maps
	if(tagMaps != null) {
		
		//loop through all the tag maps
		for(var x=0; x<tagMaps.length; x++) {
			
			//get a tag map
			var tagMapObject = tagMaps[x];
			
			if(tagMapObject != null) {
				//get the variables for the tag map
				var tagName = tagMapObject.tagName;
				var functionName = tagMapObject.functionName;
				var functionArgs = tagMapObject.functionArgs;
				
				if(functionName == "getPreviousModels") {
					
					//get the result of the check
					var result = this.checkPreviousModelsForTags(tagName, functionArgs);					
					previousModels = previousModels.concat(result.previousModels);
					custom_objects_made_count += result.custom_objects_made_count;
				} else if (functionName == "getValueFromTableForDensity"){
					var density = this.checkTableForValue(tagName, functionArgs);
				}
			}
		}
	}
	var returnObject = {};
	if (previousModels.length > 0){ 
		//put the variables in an object so we can return multiple variables
		returnObject = {"previousModels":previousModels, "custom_objects_made_count":custom_objects_made_count}; 
	} else if (typeof density != "undefined"){
		returnObject = {"density":density}; 
	}
	
	return returnObject;
};

/**
 * This function retrieves the latest student work
 * 
 * TODO: rename Box2dModel
 * 
 * @return the latest state object or null if the student has never submitted
 * work for this step
 */
Box2dModel.prototype.getLatestState = function() {
	var latestState = null;
	
	//check if the states array has any elements
	if(this.states != null && this.states.length > 0) {
		//get the last state
		latestState = this.states[this.states.length - 1];
	}
	
	return latestState;
};



/**
 * When an event that is exclusive to Box2dModel is fired it is interpreted here.
 * For each row creates a "row" of the following data, which is then structured into a table
 * id 	|	total_mass	|	total_volume	| total_density |	enclosed_mass |	enclosed_volume	| enclosed_density 
 * volume_displaced | sink_or_float | percent_submerged	 | percent_above_ | tested_in_beaker  | tested_on_scale   | tested_on_balance  
 * @param type, args, obj
 * @return 
 */
Box2dModel.prototype.interpretEvent = function(type, args, obj) {
	var evt = {};
	evt.type = type;
	var d = new Date();
	evt.time = d.getTime() - this.timestamp;
	evt.models = []; // models used in this event
	evt.details = {}; // extra details about this event
	// update model table so that when we check this event the corresponding models will be on the table
	// was orignally in save, but put it here instead - still only doing for make/delete/test
	var tableData = GLOBAL_PARAMETERS.tableData;

	// mass_vol_determined will be used for graphs
	var mass_volume_determined = false;
	var includeGraph = false;
	var isGraphEvent = false;
	var graphType = "";
	if (typeof this.content.INCLUDE_SINK_FLOAT_GRAPH === "boolean" && this.content.INCLUDE_SINK_FLOAT_GRAPH){
		includeGraph = true;
		graphType = "sink_float";
	} else if (typeof this.content.INCLUDE_MATERIAL_GRAPH === "boolean" && this.content.INCLUDE_MATERIAL_GRAPH){
		includeGraph = true;
		graphType = "material";
	}

	// loop through args looking for "Obj" models (including premades)
	for (var a = 0; a < args.length; a++){
		if ( (typeof args[a].id !== "undefined" && args[a].id.substr(0,3) == "Obj") || (typeof args[a].premade_name !== "undefined" && args[a].premade_name != null && args[a].premade_name.length > 0)){
			var model = {};
			model.id = args[a].id;
			// if there are multiple materials we'll need to get a percentage of each
			if (typeof args[a].unique_materials !== "undefined" && args[a].unique_materials.length > 0){
				if (args[a].unique_materials.length == 1){
					model.Materials = args[a].unique_materials.slice().toString();
				} else {
					// multiple materials
					var percMat = [];
					for (var m = 0; m < args[a].unique_materials.length; m++){
						var mat = args[a].unique_materials[m];
						// if rectPrismArrays availabe search through and add up volumes
						var vol = 0
						if (args[a].rectPrismArrays != null && args[a].rectPrismArrays.materials != null && args[a].rectPrismArrays.materials.length > 0){
							for (var b = 0; b < args[a].rectPrismArrays.materials.length; b++){
								if (mat == args[a].rectPrismArrays.materials[b]){
									vol += args[a].rectPrismArrays.widths[b] * args[a].rectPrismArrays.heights[b] * args[a].rectPrismArrays.depths[b];
								}
							}
						} else if (args[a].cylinderArrays != null && args[a].cylinderArrays.materials != null && args[a].cylinderArrays.materials.length > 0){
							for (var b = 0; b < args[a].cylinderArrays.materials.length; b++){
								if (mat == args[a].cylinderArrays.materials[b]){
									vol += Math.pow(args[a].cylinderArrays.diameters[b]/2 ,2) * Math.PI * args[a].rectPrismArrays.heights[b];
								}
							}
						}

						if (vol > 0){
							vol = vol / args[a].material_volume * 100;
							percMat.push(vol);
						}
					}
					if (percMat.length == args[a].unique_materials.length){
						model.Materials = "";
						for (m = 0; m < args[a].unique_materials.length; m++){
							if (m > 0) model.Materials += ", ";
							model.Materials +=  percMat[m].toFixed(0) + "% " + args[a].unique_materials[m];
						}
					} else {
						model.Materials = args[a].unique_materials.slice().sort().toString()
					}
				}
			}
			model.Total_Volume = args[a].total_volume;
			model.Widths = typeof args[a].widths !== "undefined" ? args[a].widths.toString().replace(/,/g,", ") : undefined;
			model.Heights = typeof args[a].heights !== "undefined" ? args[a].heights.toString().replace(/,/g,", ") : undefined;
			model.Depths = typeof args[a].depths !== "undefined" ? args[a].depths.toString().replace(/,/g,", ") : undefined;
			model.Width = args[a].max_width;
			model.Height = args[a].max_height;
			model.Depth = args[a].max_depth;
			model.Total_Mass = args[a].mass;
			model.Total_Density = model.Total_Mass / model.Total_Volume;
			model.Material_Mass = args[a].mass;
			model.Material_Volume = args[a].material_volume;
			model.Material_Density = model.Material_Mass / model.Material_Volume;
			model.Open_Mass = 0;
			model.Open_Volume = args[a].interior_volume;
			model.Open_Density = 0;
			model.Tested_on_Scale = 0;
			model.Tested_on_Balance = 0;
			// cycle through each liquid to gather data
			for (var i = 0; i < GLOBAL_PARAMETERS.liquids_in_world.length; i++){
				var liquid_name = GLOBAL_PARAMETERS.liquids_in_world[i];
				var liquid_density = GLOBAL_PARAMETERS.liquids[liquid_name].density;
				if (model.Total_Density > liquid_density){
					model["Sink_in_"+liquid_name] = "Sink";
				} else {
					model["Sink_in_"+liquid_name] = "Float";
				}
				model["Percent_Submerged_in_"+liquid_name] = Math.min(1, model.Total_Density / liquid_density);
				model["Percent_Above_"+liquid_name] = 1 - model["Percent_Submerged_in_"+liquid_name];
				model["Volume_Displaced_in_"+liquid_name] = model.Total_Volume * model["Percent_Submerged_in_"+liquid_name];
				model["Mass_Displaced_in_"+liquid_name] = liquid_density * model.Total_Volume * model["Percent_Submerged_in_"+liquid_name];
				model["Tested_in_"+liquid_name] = 0;
			}
			if (evt.type == "add-to-beaker" || evt.type == "test-in-beaker" || evt.type == "remove-from-beaker"){
				model["Tested_in_"+args[1].liquid_name] = 1;


			} else if (evt.type == "add-to-scale" || evt.type == "test-on-scale" || evt.type == "remove-from-scale"){
				model["Tested_on_Scale"] = 1;
			} else if (evt.type == "add-to-balance" || evt.type == "test-on-balance" || evt.type == "remove-from-balance"){
				model["Tested_on_Balance"] = 1;
			}

			// determine whether we have all the info we need to plot point
			if (evt.type == "test-in-beaker"){
				isGraphEvent = true;
				if ((typeof args[0].volume_tested === "undefined" || !args[0].volume_tested) && (typeof args[0].mass_tested !== "undefined" && args[0].mass_tested)){
					mass_volume_determined = true;
				}
				args[0].volume_tested = true;
			}
			if (evt.type == "test-on-scale" || evt.type == "test-on-balance"){
				isGraphEvent = true;
				if ((typeof args[0].mass_tested === "undefined" || !args[0].mass_tested) && (typeof args[0].volume_tested !== "undefined" && args[0].volume_tested)){
					mass_volume_determined = true;
				}
				args[0].mass_tested = true;
			}

			// create a new model in tableData if id is not found
			if (evt.type == "make-model" || evt.type == "duplicate-model"){
				isGraphEvent = true;
				var id_found = false;
				for (var i = 0; i < tableData.length; i++){
					if (tableData[i][0].text == "id"){
						for (var j=1; j < tableData[i].length; j++){
							if (tableData[i][j].text == model.id){
								id_found = true; break;
							}
						}
						break;
					}
				}
				if (!id_found){
					for (var i = 0; i < tableData.length; i++){
						if (typeof model[tableData[i][0].text] !== "undefined"){
							tableData[i].push({"text":model[tableData[i][0].text], "uneditable":true});
						} else {
							tableData[i].push({"text":"", "uneditable":true});
						}
					}
				}
			}
			// remove a model
			if (evt.type == "delete-model" || evt.type == "revise-model"){
				isGraphEvent = true;
				for (var i = 0; i < tableData.length; i++){
					if (tableData[i][0].text == "id"){
						for (var j=1; j < tableData[i].length; j++){
							if (tableData[i][j].text == model.id){
								for (var k = 0; k < tableData.length; k++){
									tableData[k].splice(j, 1)
								}
							}
						}
					}
				}
			}
			// on test update the "Tested_in" or "Tested_on" column
			if (evt.type.substr(0,4) == "test" || evt.type.substr(0,7) == "add-to-"){
				// run through keys of model looking for positive tests, then update column in tableData
				for (var key in model){
					if (key.substr(0,6) == "Tested" && model[key] == 1){
						// find id on table
						for (var i=0; i < tableData.length; i++){
							if (tableData[i][0].text == "id"){
								for (var j=1; j < tableData[i].length; j++){
									if (tableData[i][j].text == model.id){
										// search for the column matching the test
										for (var k=0; k < tableData.length; k++){
											if (tableData[k][0].text == key){
												tableData[k][j].text = 1;
											}
										}
									}
								}
							}
						}
					}
				}
			}
			evt.models.push(model);
		} else {
			// in cases where the argument is not an "Obj" (object model), just attach all keys to the evt directly
			for (var key in args[a]){
				evt.details[key] = args[a][key];
			}
		}
	}

	// check to see if this is a beaker being tested on a scale (alone)
	if (typeof args[0].id !== "undefined" && args[0].id.substr(0,2) == "bk" && evt.type == "test-on-scale" && args[1].Object_count != null && args[1].Object_count == 1
	){
		// when student puts empty beaker on the mass is tested
		if (args[0].liquid_volume != null && args[0].liquid_volume == 0){
			// set a flag on the saved object itself
			args[0].mass_tested = true;
		}
		// when students put a filled beaker on, its mass
		if (args[0].liquid_volume != null && args[0].liquid_volume > 0 && args[0].mass_tested){
			// calculate mass and add it to saved object
			args[0].liquid_mass = args[0].liquid_volume * args[0].liquid_density;
			mass_volume_determined = true;
			// test if this is unique
			var liquid_unique = true;
			for (var k = 0; k < this.liquids_tested.length; k++){
				if (this.liquids_tested[k].liquid_name == args[0].liquid_name && this.liquids_tested[k].mass == args[0].liquid_mass && this.liquids_tested[k].volume == args[0].liquid_volume){
					liquid_unique = false;
					break;
				}
			}
			if (liquid_unique){
				this.liquids_tested.push({"liquid_name":args[0].liquid_name, "mass":args[0].liquid_mass, "volume":args[0].liquid_volume});
				isGraphEvent = true;
			}
		}
	}

	// send results to graph
	if (includeGraph && isGraphEvent){
		// get index for total mass
		var massIndex = -1;
		for (var i = 0; i < tableData.length; i++){
			if (tableData[i][0].text === 'Total_Mass'){
				massIndex = i;
				break;
			}
		}
		// get index for total volume
		var volumeIndex = -1;
		for (var i = 0; i < tableData.length; i++){
			if (tableData[i][0].text === 'Total_Volume'){
				volumeIndex = i;
				break;
			}
		}
		// get index for tested in water
		var liquid_name = GLOBAL_PARAMETERS.liquids_in_world.length === 1 ? GLOBAL_PARAMETERS.liquids_in_world.length[0] : "Water";
		// get index for tested on scale
		var sinkIndex = -1;
		for (var i = 0; i < tableData.length; i++){
			if (tableData[i][0].text === 'Sink_in_' + liquid_name){
				sinkIndex = i;
				break;
			}
		}
		// get index for tested on scale
		var beakerIndex = -1;
		for (var i = 0; i < tableData.length; i++){
			if (tableData[i][0].text === 'Tested_in_' + liquid_name){
				beakerIndex = i;
				break;
			}
		}
		// get index for tested on scale
		var scaleIndex = -1;
		for (var i = 0; i < tableData.length; i++){
			if (tableData[i][0].text === 'Tested_on_Scale'){
				scaleIndex = i;
				break;
			}
		}

		// get index for material
		var materialIndex = -1;
		for (var i = 0; i < tableData.length; i++){
			if (tableData[i][0].text === 'Materials'){
				materialIndex = i;
				break;
			}
		}

		// make sure we have appropriate indices
		if (massIndex >= 0 && volumeIndex >= 0 && sinkIndex >= 0 && beakerIndex >= 0 && scaleIndex >= 0){
			// update max and min axis values to fit the data
			var xMin = 0;
			var xMax = 50;
			var yMin = 0;
			var yMax = 50;
			var seriesSpecs = [];

			if (graphType == "material" && materialIndex >= 0) {
				// find unique materials
				if (tableData[0].length > 0) {
					for (var j = 1; j < tableData[0].length; j++) {
						var material_name = tableData[materialIndex][j].text;
						// is unique?
						var thismaterialIndex = -1;
						if (seriesSpecs.length > 0) {
							for (var k = 0; k < seriesSpecs.length; k++) {
								if (seriesSpecs[k].id === material_name) {
									thismaterialIndex = k;
									break;
								}
							}
						}
						if (thismaterialIndex == -1) {
							var firstmaterial_name = material_name.replace(/[0-9]+% /g, "");
							;
							if (typeof /(.*?),|$/.exec(firstmaterial_name)[1] !== 'undefined') {
								firstmaterial_name = /(.*?),|$/.exec(firstmaterial_name)[1];
							}
							seriesSpecs.push(
								{
									id: material_name,
									name: material_name,
									color: GLOBAL_PARAMETERS['materials'][firstmaterial_name] != null ? GLOBAL_PARAMETERS['materials'][firstmaterial_name]["fill_colors"][0] : 'rgba(127, 127, 127, .5)',
									data: []
								}
							);
							thismaterialIndex = seriesSpecs.length - 1;
						}

						var point;
						if (tableData[beakerIndex][j].text === 1 && tableData[scaleIndex][j].text === 1) {
							// we have the volume and mass
							point = [tableData[volumeIndex][j].text, tableData[massIndex][j].text];
						} else if (tableData[beakerIndex][j].text == 1 && tableData[scaleIndex][j].text === 0) {
							// we have the volume and not the mass
							point = [tableData[volumeIndex][j].text, -1];
						} else if (tableData[beakerIndex][j].text == 0 && tableData[scaleIndex][j].text === 1) {
							// we have the mass and not the volume
							point = [-1, tableData[massIndex][j].text];
						} else {
							// you know nothing Jon Vitale
							point = [-1, -1];
						}
						seriesSpecs[thismaterialIndex].data.push(point);

						if (point[0] < xMin && point[0] >= 0) {
							xMin = point[0];
							yMin = point[0];
						}
						if (point[1] < yMin && point[1] >= 0) {
							xMin = point[1];
							yMin = point[1];
						}
						if (point[0] > xMax) {
							xMax = point[0];
							yMax = point[0];
						}
						if (point[1] > yMax) {
							xMax = point[1];
							yMax = point[1];
						}
					}
				}
				// were any liquids tested
				if (this.liquids_tested.length > 0) {
					for (var i = 0; i < this.liquids_tested.length; i++) {
						// is unique?
						var thismaterialIndex = -1;
						if (seriesSpecs.length > 0) {
							for (var k = 0; k < seriesSpecs.length; k++) {
								if (seriesSpecs[k].id === this.liquids_tested[i].liquid_name) {
									thismaterialIndex = k;
									break;
								}
							}
						}
						if (thismaterialIndex == -1) {
							seriesSpecs.push(
								{
									id: this.liquids_tested[i].liquid_name,
									name: this.liquids_tested[i].liquid_name,
									color: GLOBAL_PARAMETERS['liquids'][this.liquids_tested[i].liquid_name] != null ? GLOBAL_PARAMETERS['liquids'][this.liquids_tested[i].liquid_name]["stroke_color"] : 'rgba(127, 127, 127, .5)',
									data: []
								}
							);
							thismaterialIndex = seriesSpecs.length - 1;
						}

						var point = [this.liquids_tested[i].volume, this.liquids_tested[i].mass];
						seriesSpecs[thismaterialIndex].data.push(point);

						if (point[0] < xMin && point[0] >= 0) {
							xMin = point[0];
							yMin = point[0];
						}
						if (point[1] < yMin && point[1] >= 0) {
							xMin = point[1];
							yMin = point[1];
						}
						if (point[0] > xMax) {
							xMax = point[0];
							yMax = point[0];
						}
						if (point[1] > yMax) {
							xMax = point[1];
							yMax = point[1];
						}

					}
				}
			} else {
				// create arrays for sink, float, and unknown (not yet tested)
				var sinkPoints = [];
				var floatPoints = [];
				var unknownPoints = [];

				var includeUnknown = false;

				if (tableData[0].length > 0) {
					for (var j = 1; j < tableData[0].length; j++) {
						var point;
						if (tableData[beakerIndex][j].text === 1 && tableData[scaleIndex][j].text === 1) {
							if (tableData[sinkIndex][j].text === "Sink") {
								point = [tableData[volumeIndex][j].text, tableData[massIndex][j].text];
								sinkPoints.push(point);
							} else {
								point = [tableData[volumeIndex][j].text, tableData[massIndex][j].text];
								floatPoints.push(point);
							}
						} else if (tableData[beakerIndex][j].text == 1 && tableData[scaleIndex][j].text === 0) {
							// we have the volume and not the mass
							if (tableData[sinkIndex][j].text === "Sink") {
								point = [tableData[volumeIndex][j].text, includeUnknown ? -1 : 0];
								sinkPoints.push(point);
							} else {
								point = [tableData[volumeIndex][j].text, includeUnknown ? -1 : 0];
								floatPoints.push(point);
							}
						} else if (tableData[beakerIndex][j].text === 0 && tableData[scaleIndex][j].text === 1) {
							// we have the mass and not the volume
							if (!includeUnknown) {
								// we have the volume and not the mass
								if (tableData[sinkIndex][j].text === "Sink") {
									point = [tableData[volumeIndex][j].text, -1];
									sinkPoints.push(point);
								} else {
									point = [tableData[volumeIndex][j].text, -1];
									floatPoints.push(point);
								}
							} else {
								point = [0, tableData[massIndex][j].text];
								unknownPoints.push(point);
							}
						} else {
							if (!includeUnknown) {
								// you know nothing Jon Vitale
								if (tableData[sinkIndex][j].text === "Sink") {
									point = [-1, -1];
									sinkPoints.push(point);
								} else {
									point = [tableData[volumeIndex][j].text, -1];
									floatPoints.push(point);
								}
							} else {
								point = [0, 0];
								unknownPoints.push(point);
							}
						}
						if (point[0] < xMin && point[0] >= 0) {
							xMin = point[0];
							yMin = point[0];
						}
						if (point[1] < yMin && point[1] >= 0) {
							xMin = point[1];
							yMin = point[1];
						}
						if (point[0] > xMax) {
							xMax = point[0];
							yMax = point[0];
						}
						if (point[1] > yMax) {
							xMax = point[1];
							yMax = point[1];
						}
					}
				}

				seriesSpecs = [
					{
						id: 'sink',
						name: 'Sink',
						color: 'rgba(255, 0, 0, .5)',
						data: sinkPoints
					},
					{
						id: 'float',
						name: 'Float',
						color: 'rgba(0, 155, 0, .5)',
						data: floatPoints
					}
				]
				if (includeUnknown){
					seriesSpecs.push(
						{
							id: 'unknown',
							name: 'Unknown',
							color: 'rgba(127, 127, 127, .5)',
							data: unknownPoints
						}
					);
				}

				// were any liquids tested
				if (this.liquids_tested.length > 0) {
					for (var i = 0; i < this.liquids_tested.length; i++) {
						// is unique?
						var thismaterialIndex = -1;
						if (seriesSpecs.length > 0) {
							for (var k = 0; k < seriesSpecs.length; k++) {
								if (seriesSpecs[k].id === this.liquids_tested[i].liquid_name) {
									thismaterialIndex = k;
									break;
								}
							}
						}
						if (thismaterialIndex == -1) {
							seriesSpecs.push(
								{
									id: this.liquids_tested[i].liquid_name,
									name: this.liquids_tested[i].liquid_name,
									color: GLOBAL_PARAMETERS['liquids'][this.liquids_tested[i].liquid_name] != null ? GLOBAL_PARAMETERS['liquids'][this.liquids_tested[i].liquid_name]["stroke_color"] : 'rgba(127, 127, 127, .5)',
									data: []
								}
							);
							thismaterialIndex = seriesSpecs.length - 1;
						}

						var point = [this.liquids_tested[i].volume, this.liquids_tested[i].mass];
						seriesSpecs[thismaterialIndex].data.push(point);

						if (point[0] < xMin && point[0] >= 0) {
							xMin = point[0];
							yMin = point[0];
						}
						if (point[1] < yMin && point[1] >= 0) {
							xMin = point[1];
							yMin = point[1];
						}
						if (point[0] > xMax) {
							xMax = point[0];
							yMax = point[0];
						}
						if (point[1] > yMax) {
							xMax = point[1];
							yMax = point[1];
						}

					}
				}
			}

			// round max values up to nearest 50
			xMax = Math.ceil(xMax / 50) * 50;
			yMax = xMax;
			// set a tickInterval based on the xMax
			var tickInterval = 10;
			if (xMax > 500){
				tickInterval  = 100;
			} else if (xMax > 100){
				tickInterval = 50;
			} else if (xMax > 50){
				tickInterval = 20;
			}

			this.chart = {
				chart: {
					type: 'scatter',
					zoomType: 'xy',
					height: 400,
					width: 500,
					marginRight: 100
				},

				title: {
					text: "Mass vs. Volume"
				},
				subtitle: {
					text: ''
				},
				xAxis: {
					title: {
						enabled: true,
						text: "Volume (ml)"
					},
					showLastLabel: true,
					gridLineWidth: 1,
					min: xMin,
					max: xMax,
					tickInterval: tickInterval
				},
				yAxis: {
					title: {
						text: "Mass (grams)"
					},
					showLastLabel: true,
					gridLineWidth: 1,
					min: yMin,
					max: yMax,
					tickInterval: tickInterval
				},
				legend: {
					layout: 'vertical',
					align: 'right',
					verticalAlign: 'top',
					floating: true,
					x: 10,
					y: 40,
					backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
					borderWidth: 1
				},
				plotOptions: {
					scatter: {
						marker: {
							radius: 5,
							states: {
								hover: {
									enabled: true,
									lineColor: 'rgb(100,100,100)'
								}
							}
						}, states: {
							hover: {
								marker: {
									enabled: false
								}
							}
						}
					}
				},
				series: seriesSpecs
			};
			//render the chart
			this.renderChart(mass_volume_determined);
		} else {
			console.log ("problem with index (mass, vol, liq, scale)", massIndex , volumeIndex , beakerIndex , scaleIndex );
		}


	}

	var isStepCompleted = true;
	// delete args
	// run event through feedback manager
	if (typeof obj.feedbackManager !== "undefined" && obj.feedbackManager != null && evt.type != "gave-feedback"){
		 var f = obj.feedbackManager.checkEvent(evt, tableData);
		 if (f != null){
		 	eventManager.fire("gave-feedback",[f]);
		 }

		 isStepCompleted = obj.feedbackManager.completed;
		 // trick to get student constraints to end
		 //if (isStepCompleted){this.view.pushStudentWork(this.node.id, {});}
	}

	// save on a make, or delete
	//if (evt.type == "make-model" || evt.type == "delete-model" || evt.type == "revise-model" || evt.type == "duplicate-model"){
	//	obj.save(evt);
	//}	
	eventManager.fire('studentWorkUpdated', [this.node.id, this.view.getState().getNodeVisitsByNodeId(this.node.id)]);
}


/**
 * Render the chart
 * @param divId the div to render the chart in
 * @param chartObject the chart object to render
 */
Box2dModel.prototype.renderChart = function(popup) {
	var chartObject = this.chart;
	var divId;
	var otherdivId;
	if (popup){
		divId = 'chartPopUp';
		otherdivId = 'chartDiv';
	} else {
		divId = 'chartDiv';
		otherdivId = 'chartPopUp';
	}

	//check if the div exists
	if($('#' + divId).length > 0) {
		//get the highcharts object from the div
		var highchartsObject = $('#' + divId).highcharts();

		if(highchartsObject != null) {
			//destroy the existing chart because we will be making a new one
			highchartsObject.destroy();
		}
	}
	if($('#' + otherdivId).length > 0) {
		//get the highcharts object from the div
		var highchartsObject = $('#' + otherdivId).highcharts();

		if(highchartsObject != null) {
			//destroy the existing chart because we will be making a new one
			highchartsObject.destroy();
		}
	}

	if (popup) {
		$('#' + divId).dialog({
			'position': {my: "left bottom", at: "center bottom", of: "#b2canvas"},
			'autoOpen': true,
			'closeOnEscape': false,
			'modal': true,
			'close': function (event, ui) {
				box2dModel.renderChart(false);
			},
			'width': 550,
			'height': 470
		});
	}

	//set the divId into the chart object so we can access it in other contexts
	chartObject.chart.renderTo = divId;

	//render the highcharts chart
	new Highcharts.Chart(chartObject);
}


/**
 * This function retrieves the student work from the html ui, creates a state
 * object to represent the student work, and then saves the student work.
 * 
 * TODO: rename Box2dModel
 * 
 * note: you do not have to use 'studentResponseTextArea', they are just 
 * provided as examples. you may create your own html ui elements in
 * the .html file for this step (look at box2dModel.html).
 */
Box2dModel.prototype.save = function(evt) {
	//get the answer the student wrote
	if (typeof evt === "undefined") evt = {"type":"server"};

	var response = $('#studentResponseTextArea').length ? $('#studentResponseTextArea').val(): "";
	var modelData = {};
	var history = this.feedbackManager.getHistory(250000);
	var tableData = GLOBAL_PARAMETERS.tableData;

	//load with objects from library
	modelData.images = [];
	modelData.savedModels = GLOBAL_PARAMETERS.objects_made.slice();
	modelData.custom_objects_made_count = GLOBAL_PARAMETERS.custom_objects_made_count;

	// for each savedModel attach an associated image if model is not deleted
	
	for (var i = 0; i < modelData.savedModels.length; i++){
		if (typeof modelData.savedModels[i] === "undefined" || !modelData.savedModels[i].is_deleted){
			var id = modelData.savedModels[i].id;
			// go through all images looking for this id
			for (var j = 0; j < GLOBAL_PARAMETERS.images.length; j++){
				var img = GLOBAL_PARAMETERS.images[j];
				if (img.id == id){
					modelData.images.push(img);
				}
			}	
		}
	}

	// save event history
	var latestState = this.getLatestState();
	// only save if history is different from previous - otherwise we're just adding unnecessary data
	if (((latestState == null || typeof latestState.history === "undefined" ) && history.length > 0) ||
		(typeof latestState.history !== "undefined" && (latestState.history.length != history.length || (latestState.history[latestState.history.length-1].index != history[history.length-1].index))) ||
		(latestState.response == null && response.length > 0) || latestState.response !== response
	){

		console.log("---------------------- SAVING appx length -----------------------", (JSON.stringify(history).length+JSON.stringify(modelData.images).length+JSON.stringify(tableData).length+JSON.stringify(modelData.savedModels).length)*2 + response.length);
		//} 
		//go thro
		/*
		 * create the student state that will store the new work the student
		 * just submitted
		 * 
		 * TODO: rename Box2dModelState
		 * 
		 * make sure you rename Box2dModelState to the state object type
		 * that you will use for representing student data for this
		 * type of step. copy and modify the file below
		 * 
		 * vlewrapper/WebContent/vle/node/box2dModel/box2dModelState.js
		 * 
		 * and use the object defined in your new state.js file instead
		 * of Box2dModelState. for example if you are creating a new
		 * quiz step type you would copy the file above to
		 * 
		 * vlewrapper/WebContent/vle/node/quiz/quizState.js
		 * 
		 * and in that file you would define QuizState and therefore
		 * would change the Box2dModelState to QuizState below
		 */
		var box2dModelState = new Box2dModelState(response, tableData, modelData, history);
		/*
		 * fire the event to push this state to the global view.states object.
		 * the student work is saved to the server once they move on to the
		 * next step.
		 */
		this.view.pushStudentWork(this.node.id, box2dModelState);

		//push the state object into this or object's own copy of states
		this.states.push(box2dModelState);

		// we are not returning clear GLOBAL_PA
		return box2dModelState;
	} else {
		return null;
	}
};



//used to notify scriptloader that this script has finished loading
if(typeof eventManager != 'undefined'){
	/*
	 * TODO: rename box2dModel to your new folder name
	 * TODO: rename box2dModel.js
	 * 
	 * e.g. if you were creating a quiz step it would look like
	 * 
	 * eventManager.fire('scriptLoaded', 'vle/node/quiz/quiz.js');
	 */
	eventManager.fire('scriptLoaded', 'vle/node/box2dModel/box2dModel.js');
}