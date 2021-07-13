import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

declare var Stimulsoft: any;

@Component({
  selector: 'app-report-viewer',
  templateUrl: './report-viewer.component.html',
  styleUrls: ['./report-viewer.component.scss']
})
export class ReportViewerDialogComponent implements OnInit {
  viewer: any = new Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
  report: any = new Stimulsoft.Report.StiReport();
  dataSet: any;

  /**
  * This Method For report Options setting
  */
  initReportSetting() {
    let options = new Stimulsoft.Viewer.StiViewerOptions();
    // options.appearance.scrollbarsMode = false;
    // options.appearance.backgroundColor = Stimulsoft.System.Drawing.Color.white;
    // options.appearance.pageBorderColor = Stimulsoft.System.Drawing.Color.navy;
    // options.toolbar.borderColor = Stimulsoft.System.Drawing.Color.navy;
    // options.toolbar.showPrintButton = true;
    // options.toolbar.showViewModeButton = false;

    options.toolbar.showAboutButton = false;
    options.toolbar.showDesignButton = true;
    // options.toolbar.viewMode=Stimulsoft.Viewer.StiWebViewMode.WholeReport;
    // options.toolbar.visible = true;
    // options.toolbar.zoom = 50;
    return options;
  }

  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(): void {
    // Stimulsoft.Base.StiFontCollection.addOpentypeFontFile('./assets/fonts/AlinmaTheSans-Bold.woff', 'Conv_AlinmaTheSans-Bold');
    this.generateInvoice();
  }

  generateInvoice() {
    this.viewer = new Stimulsoft.Viewer.StiViewer(this.initReportSetting(), "StiViewer", false);


    this.viewer.report = new Stimulsoft.Report.StiReport();


    console.log('create new DataSet Object');
    this.dataSet = new Stimulsoft.System.Data.DataSet("Demo22");

    // this.dataSet.readJson(this.invoice());

    var fileContent = Stimulsoft.System.IO.File.getFile("assets/fonts/AlinmaTheSans-Bold.ttf","AlinmaTheSans-Bold", true);
    var resource = new Stimulsoft.Report.Dictionary.StiResource(
      "AlinmaTheSans-Bold", "AlinmaTheSans-Bold", false, Stimulsoft.Report.Dictionary.StiResourceType.FontTtf, fileContent);
    this.report.dictionary.resources.add(resource);


    this.report.loadFile('https://res.cloudinary.com/genhub/raw/upload/v1626185587/DamPharmLat_Invoice_latest_4_bsmhex_nr2aee.mrt');

    this.report.regData("Demo22", "Demo22", this.dataSet);
    this.report.dictionary.synchronize();

    this.viewer.report = this.report;

    console.log('Rendering the viewer to selected element');
    this.viewer.renderHtml('viewer');
    // });

    var designer = new Stimulsoft.Designer.StiDesigner(null, "StiDesigner", false);

    this.viewer.onDesignReport = function (args) {

      designer.report = this.report;
      designer.renderHtml("viewer");

    }


    console.log('Loading completed successfully!');




    designer.onSaveReport = function (event) {

      var jsonStr = event.report.saveToJsonString();

      console.log("saving a report:" + jsonStr);
    }

    designer.onSaveAsReport = function (event) {

      var jsonStr = event.report.saveToJsonString();

      console.log("saving a report:" + jsonStr);
    }


  }

}
