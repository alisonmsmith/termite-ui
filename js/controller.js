$(document).ready(function () {
	// load the data
	var topics = [];
	//$.ajax({
	//	url: "http://treetm.jcchuang.org/nsf1k_mallet/vis/GroupInABox?format=json&termLimit=5",
	//	success: function (data) {
			var counter = 0;
			for (var topic in data.TopTermsPerTopic) {
				var nodes = [];
				var edges = [];
				$.each(data.TopTermsPerTopic[topic], function (index, term) {
					// TODO: I really don't like how this is being stored in the JSON... 
					for (var k in term) {
						nodes.push({"name":k, "value":term[k]});
					}
				});
				// Determine the edges for each node
				// TODO: a better data structure may make this more efficient
				$.each(nodes, function (source, node) {
					$.each(data.TermCoFreqs[node.name], function (term, value) {
						if (value > 500 && term !== node.name) {
							$.each(nodes, function (target, node2) {
								if (term === node2.name) {
									edges.push({"source":source, "target":target, "value":value});
								}
							});
						}
					});
				})
				topics.push({"nodes":nodes, "edges":edges, "id":"topic" + counter});
				counter += 1;
			}
			$.each(topics, function (index, topic) {
				// Add a div to the html
				$("#topics").append("<span class='topic' id='" + topic.id + "'></span>");
				// Render the topic
				renderTopic(topic);
			});

			for (var term in data.TermCoFreqs) {

			}

		//},
		//failure: function (msg) {
		//	console.log("failure: " + msg);
		//}
	//});

		/*for (var term in topicmodeldata.TermCoFreqs) {
			if (topic.indexOf(term) !== -1) {
				for (var term2 in topicmodeldata.TermCoFreqs[term]) {
					if (term !== term2) {
											if (topic.indexOf(term2) !== -1) {
						// Add an edge
						edges.push({
							"source":topic.indexOf(term),
							"target":topic.indexOf(term2),
							"value":topicmodeldata.TermCoFreqs[term][term2]
						});
					}
					}

				}
			}
		}*/

		
	//});
});

function renderTopic(topic) {
	var width = 200,
    height = 200;

	var color = d3.scale.category20();

	var k = Math.sqrt(topic.nodes.length / (width * height));
	var d = 2*topic.edges.length/(topic.nodes.length*(topic.nodes.length-1));


	//TODO: should the force directed layout take edge weight into account? 
	var force = d3.layout.force()
	    .charge(-10 / k)
    	.gravity(80 * k)
    	// a denser graph needs the nodes to be pushed further away
	    .linkDistance(Math.min(Math.max(30, 200*d), 200))
	    //.linkStrength(function (d) { return Math.min(d.value/1000, 1); })
	    .size([width, height]);

	var svg = d3.select("#" + topic.id).append("svg")
	    .attr("width", width)
	    .attr("height", height);

	
	  force
	      .nodes(topic.nodes)
	      .links(topic.edges)
	      .start();

	  var link = svg.selectAll(".link")
	       .data(topic.edges)
	       .enter().append("line")
	       .attr("class", "link");
	      // .style("stroke-width", function(d) { return Math.sqrt(d.value/100); });

	  	var node = svg.selectAll("g.node")
	      	.data(topic.nodes)
	        .enter().append("g")
			.attr("class", function(d) { return "node node__"+d.name })
			// Highlight all matching term nodes
			.on( "mouseover", function(d) { d3.selectAll("g.node__"+d.name).selectAll("circle").style("fill", "#2ECC71").style("stroke", "#2ECC71") })
			.on( "mouseout", function(d) { d3.selectAll("g.node__"+d.name).selectAll("circle").style("fill", null).style("stroke", null) });

	    var circle = node.append("circle")
	    	.attr("class", "circle")
	    	.attr("r", function (d) { return Math.min(d.value/10, 40) + "px"; })
	    	.call(force.drag);

	    var label = node.append("text")
	    	.attr("class", "term")
	    	.text(function(d) { return d.name})
	    	.attr("text-anchor", "middle");

	  node.append("title")
	      .text(function(d) { return d.name; });

	  force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("transform", function(d) { 
    		return 'translate(' + [d.x, d.y] + ')'; 
  		}); 

	  });
}