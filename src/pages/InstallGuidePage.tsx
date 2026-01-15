import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Monitor, Chrome, Info } from 'lucide-react';

export default function InstallGuidePage() {
  return (
    <div className="container mx-auto p-4 xl:p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl xl:text-4xl font-bold gradient-text">
            ऐप इंस्टॉल करें
          </h1>
          <p className="text-muted-foreground">
            अपने डिवाइस पर PM - Roit को इंस्टॉल करने के लिए नीचे दिए गए स्टेप्स फॉलो करें
          </p>
        </div>

        {/* Benefits */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>इंस्टॉल करने के फायदे:</strong> ऑफलाइन एक्सेस, तेज़ लोडिंग, होम स्क्रीन से सीधे खोलें, पुश नोटिफिकेशन
          </AlertDescription>
        </Alert>

        {/* Installation Tabs */}
        <Tabs defaultValue="android" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="android">
              <Smartphone className="h-4 w-4 mr-2" />
              Android
            </TabsTrigger>
            <TabsTrigger value="ios">
              <Smartphone className="h-4 w-4 mr-2" />
              iPhone
            </TabsTrigger>
            <TabsTrigger value="desktop">
              <Monitor className="h-4 w-4 mr-2" />
              Desktop
            </TabsTrigger>
          </TabsList>

          {/* Android Instructions */}
          <TabsContent value="android" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Chrome className="h-5 w-5" />
                  Android Chrome में इंस्टॉल करें
                </CardTitle>
                <CardDescription>
                  Google Chrome ब्राउज़र में PM - Roit खोलें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Chrome में वेबसाइट खोलें</p>
                      <p className="text-sm text-muted-foreground">
                        अपने Android फोन पर Chrome ब्राउज़र में PM - Roit खोलें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Menu खोलें (⋮)</p>
                      <p className="text-sm text-muted-foreground">
                        ऊपर दाईं ओर तीन dots (⋮) पर टैप करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">"Add to Home screen" चुनें</p>
                      <p className="text-sm text-muted-foreground">
                        मेनू में से "Add to Home screen" या "Install app" ऑप्शन पर टैप करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium">"Install" पर टैप करें</p>
                      <p className="text-sm text-muted-foreground">
                        Confirm करने के लिए "Install" या "Add" बटन पर टैप करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">हो गया! 🎉</p>
                      <p className="text-sm text-muted-foreground">
                        अब आप अपने होम स्क्रीन से PM - Roit को खोल सकते हैं
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* iOS Instructions */}
          <TabsContent value="ios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  iPhone Safari में इंस्टॉल करें
                </CardTitle>
                <CardDescription>
                  Safari ब्राउज़र में PM - Roit खोलें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Safari में वेबसाइट खोलें</p>
                      <p className="text-sm text-muted-foreground">
                        अपने iPhone पर Safari ब्राउज़र में PM - Roit खोलें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Share बटन दबाएं</p>
                      <p className="text-sm text-muted-foreground">
                        नीचे बीच में Share आइकन (□↑) पर टैप करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">"Add to Home Screen" चुनें</p>
                      <p className="text-sm text-muted-foreground">
                        नीचे स्क्रॉल करें और "Add to Home Screen" ऑप्शन पर टैप करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium">"Add" पर टैप करें</p>
                      <p className="text-sm text-muted-foreground">
                        ऊपर दाईं ओर "Add" बटन पर टैप करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">हो गया! 🎉</p>
                      <p className="text-sm text-muted-foreground">
                        अब आप अपने होम स्क्रीन से PM - Roit को खोल सकते हैं
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Desktop Instructions */}
          <TabsContent value="desktop" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Desktop Chrome में इंस्टॉल करें
                </CardTitle>
                <CardDescription>
                  Google Chrome ब्राउज़र में PM - Roit खोलें
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Chrome में वेबसाइट खोलें</p>
                      <p className="text-sm text-muted-foreground">
                        अपने कंप्यूटर पर Chrome ब्राउज़र में PM - Roit खोलें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Install आइकन देखें</p>
                      <p className="text-sm text-muted-foreground">
                        Address bar के दाईं ओर Install (⊕) आइकन पर क्लिक करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium">"Install" पर क्लिक करें</p>
                      <p className="text-sm text-muted-foreground">
                        Popup में "Install" बटन पर क्लिक करें
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">हो गया! 🎉</p>
                      <p className="text-sm text-muted-foreground">
                        अब PM - Roit एक अलग window में खुलेगा और आपके Apps में दिखेगा
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>वैकल्पिक तरीका:</strong> Menu (⋮) → "Install PM - Roit" या "Create shortcut" पर क्लिक करें
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>मदद चाहिए?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• अगर Install ऑप्शन नहीं दिख रहा है, तो सुनिश्चित करें कि आप Chrome या Safari ब्राउज़र use कर रहे हैं</p>
            <p>• कुछ पुराने ब्राउज़र versions में PWA install support नहीं है</p>
            <p>• अगर फिर भी समस्या है, तो वेबसाइट को bookmark करें और सीधे ब्राउज़र से use करें</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
