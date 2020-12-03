<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Dform Demo - Update</title>

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
		<div class="container">
			<div class="jumbotron">
				<h1 class="text-center">Dform Demo</h1>
				
				<div id="dform1">
					<h3>Form 1</h3>
					<div class="errorMsg" style="display:none;">Please fill in the required fields</div>
					<div class="successMsg" style="display:none;">Generic Success Message</div>
					<form action="formProcess.php" name="frmLogin" method="post" role="form">
						<input name="frmAction" type="hidden" value="form1" />
						<input name="submitted" type="hidden" value="" />
						<div class="form-group">
							<label class="control-label" for="exampleInputEmail1">Email address</label>
							<input name="email" type="email" class="form-control" id="exampleInputEmail1" placeholder="Enter email">
						</div>
						<button type="submit" class="btn btn-primary subBtn">Submit</button>
					</form>
				</div>
				
				<hr style="border-color:#000;" />
				<div id="dform2">
					<h3>Form 2</h3>
					<div class="errorMsg text-danger" style="display:none;">Please fill in the required fields</div>
					<div class="successMsg text-success" style="display:none;">Generic Success Message</div>
					<form action="formProcess.php" name="frmLogin" method="post" role="form">
						<input name="frmAction" type="hidden" value="form2" />
						<input name="submitted" type="hidden" value="" />
						<div class="form-group">
							<label class="control-label" for="exampleInputEmail2">Email address</label>
							<input name="email" type="email" class="form-control" id="exampleInputEmail2" placeholder="Enter email">
						</div>
						<div class="checkbox">
							<label class="control-label">
								<input type="radio" name="simulate" value="success" checked> Simulate Success
							</label>
						</div>
						<div class="checkbox">
							<label class="control-label">
								<input type="radio" name="simulate" value="redirect"> Simulate Success - Redirect
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
				<hr style="border-color:#000;" />
				
				<div id="dform3">
					<h3>Form 3 - modals</h3>
					<div class="errorMsg" style="display:none;">Please fill in the required fields</div>
					<div class="successMsg" style="display:none;">Generic Success Message</div>
					<form action="formProcess.php" name="frmLogin" method="post" role="form">
						<input name="frmAction" type="hidden" value="form3" />
						<input name="submitted" type="hidden" value="" />
						<div class="form-group">
							<label class="control-label" for="exampleInputEmail3">Email address</label>
							<input name="email" type="email" class="form-control" id="exampleInputEmail3" placeholder="Enter email">
						</div>
						<div class="form-group">
							<label class="control-label" for="modalType">Modal Type</label>
							<select name="modalType" class="form-control" id="modalType">
								<option value="bootstrap">Bootstrap</option>
								<option value="tinybox">Tinybox 2</option>
								<option value="fancybox">Fancybox</option>
								<option value="jqueryui">jQuery UI</option>
							</select>
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
				<hr style="border-color:#000;" />
				
				<h5><a href="#" id="modalFormClick">Click to Launch Form In Modal Iframe (bootstrap)</a></h5>
				<h5><a href="#" id="modalFormClickFB">Click to Launch Form In Modal Iframe (fancybox)</a></h5>
				
				
				<hr style="border-color:#000;" />
				<div id="dform5">
					<h3>Form 5 - Scroll</h3>
					<div class="errorMsg text-danger" style="display:none;">Please fill in the required fields</div>
					<div class="successMsg text-success" style="display:none;">Generic Success Message</div>
					<form action="formProcess.php" name="frmLogin" method="post" role="form">
						<input name="frmAction" type="hidden" value="form5" />
						<input name="submitted" type="hidden" value="" />
						<?php
						for ($i=1; $i <= 10; $i++) {
							?>
							<div class="form-group">
								<label class="control-label" for="field<?php echo $i;?>">Sample Field <?php echo $i;?></label>
								<input type="text" name="field<?php echo $i;?>" class="form-control" id="field<?php echo $i;?>" placeholder="Field <?php echo $i;?> *">
							</div>	
							<?php
						}
						?>
						<button type="button" class="btn btn-primary subBtn">Submit</button>
					</form>
				</div>
				<hr style="border-color:#000;" />
				
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
				$('#dform1').dform({
					onComplete	: function(){
						$('#dform1').find('form').html('Custom Callback');
					},
				});
				
				$('#dform2').dform();
				
				$('#dform3').dform({
					successType: 'modal',
					fullErrorType: 'modal'
				});
				
				$('#modalFormClick').click(function(e){
					e.preventDefault();
					
					$('#modalFormTitle').html('Modal Form');
					$('#modalFormContent').html('<iframe src="modalForm.php?modal=bootstrap" style="width:100%;height:350px;border:0;overflow:hidden;"></iframe>');
					$('#modalForm').modal('show');
				});
				
				$('#modalFormClickFB').click(function(e){
					e.preventDefault();

					$.fancybox.open({
						type: 'iframe',
						href: 'modalForm.php?modal=fancybox',
						iframe: {
							scrolling : 'no'
						}
					});
				});
				
				$('#dform5').dform({
					scrollFirstOnError: true
				});
			});
		</script>
		<div class="modal fade" id="modalForm" role="dialog"aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
						<h4 class="modal-title" id="modalFormTitle"></h4>
					</div>
					<div class="modal-body" id="modalFormContent">
						
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>