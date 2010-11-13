<?php
// $Id: gdriving-marker.tpl.php,v 1.1.2.2 2010/04/12 21:59:04 tyabut Exp $

/**
 * @file
 * The gdriving-marker theme
 *
 * The gdriving-block theme allows users to customize markers' window display
 * @see template_preprocess_gdriving_marker()
 */

?>
<div class="directions">
  <p><?php echo t('Directions'); ?>: <a href="javascript:Drupal.gdriving.directionsToHereFormDisplay()"><?php echo t('To here'); ?></a> - <a href="javascript:Drupal.gdriving.directionsFromHereFormDisplay()"><?php echo t('From here'); ?></a></p>
</div>
<div class="directionsTo">
<p><acronym title="<?php echo t($tooltip); ?>"><?php echo t('Start'); ?></acronym>:
<br />
<span class="small"><?php echo $gdriving_example; ?></span>
<br />
<form action="javascript:Drupal.gdriving.getDirections()">
  <?php if($show_direction_types): ?>
  <input type="radio" name="gdriving_type" id="gdriving_driving" value="driving" checked="checked" /><label for="gdriving_driving"><?php echo t('Driving Directions'); ?></label>
  <input type="radio" name="gdriving_type" id="gdriving_walking" value="walking" /><label for="gdriving_walking"><?php echo t('Walking Directions'); ?></label>
  <br />
  <?php endif; ?>
  <input type="text" size="40" maxlength="100" name="saddr" class="saddr" value="" />
  <input type="hidden" class="daddr" name="daddr" value="<?php echo $latitude; ?>,<?php echo $longitude; ?>(<?php echo $name; ?>)" />
  <input value="<?php echo t('Get Directions'); ?>" type="submit" class="gdriving_submit" />
</form>
</p>
</div>
<div class="directionsFrom">
<p><acronym title="<?php echo t($tooltip); ?>"><?php echo t('End'); ?></acronym>:
<br />
<span class="small"><?php echo $gdriving_example; ?></span>
<br />
<form action="javascript:Drupal.gdriving.getDirections()">
  <?php if($show_direction_types): ?>
  <input type="radio" name="gdriving_type" id="gdriving_driving" value="driving" checked="checked" /><label for="gdriving_driving"><?php echo t('Driving Directions'); ?></label>
  <input type="radio" name="gdriving_type" id="gdriving_walking" value="walking" /><label for="gdriving_walking"><?php echo t('Walking Directions'); ?></label>
  <br />
  <?php endif; ?>
  <input type="text" size="40" maxlength="100" name="daddr" class="daddr" value="" />
  <input type="hidden" class="saddr" name="saddr" value="<?php echo $latitude; ?>,<?php echo $longitude; ?>(<?php echo $name; ?>)" />
  <input value="<?php echo t('Get Directions'); ?>" type="submit" class="gdriving_submit" />
</form>
</p>
</div>
<div class="directionsBack">
<a href="javascript:Drupal.gdriving.backToNodeInfo()"><?php echo $back_text; ?></a>
</div>
