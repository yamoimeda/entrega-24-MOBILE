package com.entrega24app;
import com.example.lc_print_sdk.PrintUtil;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import android.widget.Toast;
import android.content.Context;

import java.util.concurrent.Executors;


public class ImprimirEtiqueta extends ReactContextBaseJavaModule implements PrintUtil.PrinterBinderListener {


    private final Context context;

    ImprimirEtiqueta(ReactApplicationContext context) {
        super(context);
        this.context = context.getApplicationContext();
    }

    @Override
    public String getName() {
        return "ImprimirEtiqueta";
    }

    @ReactMethod
    public void Imprimir(ReadableMap readableMap){
        //Toast.makeText(context, name, Toast.LENGTH_SHORT).show();
        PrintUtil printUtil = PrintUtil.getInstance(context);

// Step 2: set print result callback listening
        printUtil.setPrintEventListener (this);// Set listening
// Step 3: label settings
        //printUtil.setUnwindPaperLen (15);// Set paper return distance

        printUtil.printEnableMark (false);// Open Black Label
        printUtil.printConcentration (20);// Set concentration
        printUtil.setFeedPaperSpace(500);
// Step 4: print text
        //large
        printUtil.printFontSize (5);
        printUtil.printTextBold(true);
        printUtil.printText(2,5, true, false, "Entrega24");
        printUtil.printLine (1);
        printUtil.printText(1,5, true, false, "De parte:");
        printUtil.printLine (1);
        printUtil.printText(3,3, false, false, readableMap.getString("cliente_nombre"));
        printUtil.printLine (1);
        printUtil.printText(1,5, true, false, "Para:");
        printUtil.printLine (1);
        printUtil.printText(3,3, false, false, readableMap.getString("NOMBRE CONTACTO"));
        printUtil.printLine (1);
        printUtil.printText(3,3, false, false, readableMap.getString("TELEFONO"));
        printUtil.printLine (1);
        printUtil.printText(1,5, true, false, "Entregar a:");
        printUtil.printLine (1);
        printUtil.printText(3,3, false, false, readableMap.getString("DIRECCION"));
        printUtil.printLine (1);

        //printUtil.printText(3,3, false, false, readableMap.getString("NOTAS"));
        //printUtil.printLine (1);
        printUtil.printText(1,5, true, false, "Tamaño:");
        printUtil.printLine (1);
        printUtil.printText(3,3, false, false, readableMap.getString("tamano"));

        printUtil.printLine (1);
        printUtil.printText(1,5, true, false, "UID de Paquete");
        printUtil.printLine (1);
        printUtil.printText(3,3, false, false, readableMap.getString("uid"));
        printUtil.printLine (1);

        //middle
        printUtil.printQR(2, 300, readableMap.getString("uid"));
        printUtil.printLine (4);
// Step 5: paper feeding
        printUtil.start();

        /*printUtil.printFontSize (MODE_ENLARGE.NORMAL);
        printUtil.printTextBold(true);
        printUtil.printAlignment (ALIGN_MODE.ALIGN_LEFT);
        printUtil.printTextBold(false);
        printUtil.printFontSize (MODE_ENLARGE.NORMAL);
        printUtil.printLine (1);
        printUtil.printAlignment (ALIGN_MODE.ALIGN_LEFT);
        printUtil.printLine (1);
        printUtil.printTwoColumn ("Time: ", "2017-05-09 15:50:41");
        printUtil.printLine (1);
        printUtil.printTwoColumn ("order number:", "1");
        printUtil.printLine (1);
        printUtil.printTwoColumn ("Payer:", "VitaminChen");
        printUtil.printLine (1);
        printUtil.printDashLine ();
        printUtil.printLine (1);
        printUtil.printText ("commodity");
        printUtil.printTabSpace (2);
        printUtil.printText("Quantity");
        printUtil.printTabSpace (1);
        printUtil.printText ("unit price");
        printUtil.printLine (1);
        printUtil.printThreeColumn ("iphone6", "1", "4999.00");
        printUtil.printThreeColumn ("iphone6", "1", "4999.00");
        printUtil.printDashLine ();
        printUtil.printLine (1);
        printUtil.printTwoColumn ("order amount:", "9998.00");
        printUtil.printLine (1);
        printUtil.printTwoColumn ("Amount received:", "10000.00");
        printUtil.printLine (1);
        printUtil.printTwoColumn ("Change:", "2.00");
        printUtil.printLine (1);
        printUtil.printLine (1);
        printUtil.printBarcode(10, name, 71);
        printUtil.printLine (1);
        printUtil.printQR (2, 200, "1234456");
        printUtil.printLine (2);
        printUtil.printGoToNextMark();*/


    }


    @Override
    public void onPrintCallback(int i) {

    }

    @Override
    public void onVersion(String s) {

    }
}
