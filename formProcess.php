<?php

/* 
 * Sample file for returning success/error to forms using dform
 */

$return = array(
	'status'	=> 'error', // status error or success
);

if (isset($_POST['frmAction'])) {
	switch ($_POST['frmAction']) {
		case 'form1':
			break;
		case 'form3':
			$return['redirect'] = 'index.php';
			$return['modalType'] = $_POST['modalType'];
		case 'form2':
		case 'form4':
			if ($_POST['simulate'] == 'error') {
				$return['errFlds'] = array('email');
			} else if ($_POST['simulate'] == 'success') {
				$return['status'] = 'success';
			} else if ($_POST['simulate'] == 'redirect') {
				$return['status'] = 'success';
				$return['redirect'] = 'index.php';
				$return['successType'] = 'redirect';
			} else {
				
			}
			break;
		case 'form5':
			$return['errFlds'] = array();
			for ($i=1; $i <= 10; $i++) {
				if ($_POST['field'.$i] == '') $return['errFlds'][] = 'field'.$i;
			}
			break;
	}
}

die(json_encode($return));
