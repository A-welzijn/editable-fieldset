# A-Welzijn Panel en Panel fields

v1.0.15

### Hoe het eruit ziet

![Screenshot](https://s3.amazonaws.com/f.cl.ly/items/2H3R2U0K0820370W2Y1L/panel.PNG)

### Hoe het te gebruiken

```javascript
"dependencies": {
	"awelzijn-panel": "latest"
 }
```
```javascript
var app = angular.module('yourApp', [
	'awelzijn.panel'
]);
```

#### Panel

```html
<a-welzijn-panel title="Testje">
	<h1>Jawadde dadde</h1>
	<p>Random tekst.</p>
</a-welzijn-panel>
```
In deze directive kan je ook gemakkelijk de [loading-overlay](https://github.com/A-welzijn/loading-overlay)-directive gebruiken.

#### Panel field

```html
<a-welzijn-panel-field title="Test" label="{{ctrl.vandaag | date}}"></a-welzijn-panel-field>
```
Deze directive is vooral te gebruiken in combinatie met de Panel, maar kan eventueel ook in een modal (of in principe eender waar) gebruikt worden.

Deze gaat per *field* een titel en een label genereren die samen de helft van de bruikbare breedte gaan innemen. Deze kan overschreven worden door het `colspan` attribuut te gebruiken:
```html
<a-welzijn-panel-field colspan="12" title="Lange content" label="{{ctrl.loremipsum}}"></a-welzijn-panel-field>
```
![Screenshot](https://s3.amazonaws.com/f.cl.ly/items/3B2s3K100l003a3c0b09/panellang.PNG)

Deze directive heeft ook een optie om van label over te schakelen naar een input veld, zodat een edit-modus gemakkelijk kan getoggled worden.
Het input veld schrijf je gewoon tussen het panel-field element.
```html
<dgp-panel-field edit-mode="ctrl.editMode" title="Datum" label="{{ctrl.datum | date:'dd/MM/yyyy'}}">
	<data-tink-datepicker data-ng-model="ctrl.datum"></data-tink-datepicker>
</dgp-panel-field>
```
Hiervoor voeg je gewoon het `edit-mode`-attriuut toe, deze is een boolean waarde op je controller. Deze voeg je toe op al je panel-fields en trigger je eventueel via een knop in je panel.
![Screenshot](https://s3.amazonaws.com/f.cl.ly/items/0s3r1k2a3V302r3A3i1Q/paneledit.PNG)