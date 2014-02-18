$(document).ready(function () {
	// load the data
	//d3.json("data/10topics-10words.json", function(error, topicmodel) {
		//for (var topic in data.topics) {}

		var topic = [];
		var nodes = [];
		var edges = [];

			for (var term in topicmodeldata.TermCoFreqs) {
				topic.push(term);
				nodes.push({"name":term});
			}

		for (var term in topicmodeldata.TermCoFreqs) {
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
		}

		renderTopic({"nodes":nodes, "edges":edges}, "topic1");
	//});
});

function renderTopic(data, id) {
	var width = 200,
    height = 200;

	var color = d3.scale.category20();

	var force = d3.layout.force()
	    .charge(-120)
	    .linkDistance(50)
	    .size([width, height]);

	var svg = d3.select("#" + id).append("svg")
	    .attr("width", width)
	    .attr("height", height);

	
	  force
	      .nodes(data.nodes)
	      .links(data.edges)
	      .start();

	  var link = svg.selectAll(".link")
	      .data(data.edges)
	    .enter().append("line")
	      .attr("class", "link");
	      //.style("stroke-width", function(d) { return (d.value/1000); });

	  var node = svg.selectAll(".node")
	      .data(data.nodes)
	    .enter().append("circle")
	      .attr("class", "node")
	      .attr("r", 5)
	      .call(force.drag);

	  node.append("title")
	      .text(function(d) { return d.name; });

	  force.on("tick", function() {
	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    node.attr("cx", function(d) { return d.x; })
	        .attr("cy", function(d) { return d.y; });
	  });
}