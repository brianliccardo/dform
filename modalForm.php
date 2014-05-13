<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Dform Demo</title>

		<!-- Bootstrap -->
		<link href="http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css" rel="stylesheet">

		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
			<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
			<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
		
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
		<link type="text/css" rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/themes/redmond/jquery-ui.min.css" />
	</head>
	<body>
		<div class="jumbotron">			
			<div id="dform10">
				<h3>Modal Form</h3>
				<div class="errorMsg" style="display:none;">Please fill in the required fields</div>
				<div class="successMsg" style="display:none;">Generic Success Message</div>
				<form action="formProcess.php" name="frmLogin" method="post" role="form">
					<input name="frmAction" type="hidden" value="form4" />
					<input name="submitted" type="hidden" value="" />
					<div class="form-group">
						<label class="control-label" for="exampleInputEmail1">Email address</label>
						<input name="email" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
					</div>
					<div class="checkbox">
						<label class="control-label">
							<input type="radio" name="simulate" value="success" checked> Simulate Success
						</label>
					</div>
					<div class="checkbox">
						<label class="control-label">
							<input type="radio" name="simulate" value="error"> Simulate Error
						</label>
					</div>
					<button type="submit" class="btn btn-primary subBtn">Submit</button>
				</form>
			</div>
		</div>
		
		<!-- DFORM -->
		<script type="text/javascript" src="dform/dform.js"></script>
		<link type="text/css" rel="stylesheet" href="dform/dform.css" />
		
		<!-- BLOAD -->
		<script type="text/javascript" src="bload/bload.js"></script>
		<link type="text/css" rel="stylesheet" href="bload/bload.css" />
		
		<!-- TINYBOX 2 -->
		<script type="text/javascript" src="assets/tinybox/packed.js"></script>
		<link type="text/css" rel="stylesheet" href="assets/tinybox/style.css" />
		
		<!-- FANCYBOX 2 -->
		<script type="text/javascript" src="assets/fancybox/jquery.fancybox.pack.js"></script>
		<link type="text/css" rel="stylesheet" href="assets/fancybox/jquery.fancybox.css" />
		
		<script>
			$(document).ready(function(){
				$('#dform10').dform({
					successType: 'showhide',
					onSuccess: function(){
						setTimeout(function(){
							parent.$('#modalForm').modal('hide');
						},2000);
					}
				});
			});
		</script>
	</body>
</html>