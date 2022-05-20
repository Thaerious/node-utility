import convert from "../src/convertdelimited.js";
import assert from "assert";

describe("Test Convert Names", function () {
    describe("dash-delimited", function(){
        it("captials get a dash and changed to lowercase", ()=>{
            const actual = convert.dash("firstSecondThird");
            const expected = "first-second-third";
            assert.strictEqual(actual, expected);
        });
        it("all letters following a dash become lowercase", ()=>{
            const actual = convert.dash("First-Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });
        it("leading capitals do not get a dash", ()=>{
            const actual = convert.dash("FirstSecond");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });
        it("leading dashes are removed", ()=>{
            const actual = convert.dash("-FirstSecond");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });
        it("multiple dashes are reduced to one", ()=>{
            const actual = convert.dash("--First---Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });   
        it("underscores become dashes", ()=>{
            const actual = convert.dash("First_Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });  
        it("multiple underscores become single dashes", ()=>{
            const actual = convert.dash("First__Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });  
        it("leading underscores are removed", ()=>{
            const actual = convert.dash("_First_Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        }); 
        it("leading mulitiple underscores are removed", ()=>{
            const actual = convert.dash("__First__Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });           
        it("mixed underscore and capilization", ()=>{
            const actual = convert.dash("First_SecondThird");
            const expected = "first-second-third";
            assert.strictEqual(actual, expected);
        });                                          
        it("spaces become dashes", ()=>{
            const actual = convert.dash("First Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });  
        it("multiple spaces become single dashes", ()=>{
            const actual = convert.dash("First  Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });  
        it("leading spaces are removed", ()=>{
            const actual = convert.dash(" First Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        }); 
        it("leading mulitiple are removed", ()=>{
            const actual = convert.dash("  First  Second");
            const expected = "first-second";
            assert.strictEqual(actual, expected);
        });           
        it("mixed spaces, underscores and capilization", ()=>{
            const actual = convert.dash("First_SecondThird Fourth");
            const expected = "first-second-third-fourth";
            assert.strictEqual(actual, expected);
        });
        it("paths only use the final part", ()=>{
            const actual = convert.dash("one/two/threeFour");
            const expected = "three-four";
            assert.strictEqual(actual, expected);
        });   
        it("paths remove extensions", ()=>{
            const actual = convert.dash("one/two/threeFour.js");
            const expected = "three-four";
            assert.strictEqual(actual, expected);
        });               
    });

    describe("PascalCase", function(){
        it("first letter gets capitalized", ()=>{
            const actual = convert.pascal("firstSecondThird");
            const expected = "FirstSecondThird";
            assert.strictEqual(actual, expected);
        });        
        it("all letters following a dash become uppercase", ()=>{
            const actual = convert.pascal("first-second");
            const expected = "FirstSecond";
            assert.strictEqual(actual, expected);
        });
        it("leading dashes are removed", ()=>{
            const actual = convert.pascal("-FirstSecond");
            const expected = "FirstSecond";
            assert.strictEqual(actual, expected);
        });
        it("multiple dashes are removed", ()=>{
            const actual = convert.pascal("--First---Second");
            const expected = "FirstSecond";
            assert.strictEqual(actual, expected);
        });   
        it("underscores are removed", ()=>{
            const actual = convert.pascal("_First_Second");
            const expected = "FirstSecond";
            assert.strictEqual(actual, expected);
        });  
        it("multiple underscores are removed", ()=>{
            const actual = convert.pascal("First__Second");
            const expected = "FirstSecond";
            assert.strictEqual(actual, expected);
        });  
        it("spaces are removed", ()=>{
            const actual = convert.pascal(" First  Second ");
            const expected = "FirstSecond";
            assert.strictEqual(actual, expected);
        });                 
        it("mixed spaces, underscores, dashes and capilization", ()=>{
            const actual = convert.pascal("-First_SecondThird  Fourth");
            const expected = "FirstSecondThirdFourth";
            assert.strictEqual(actual, expected);
        });
        it("paths only use the final part", ()=>{
            const actual = convert.pascal("one/two/threeFour");
            const expected = "ThreeFour";
            assert.strictEqual(actual, expected);
        });   
        it("paths remove extensions", ()=>{
            const actual = convert.pascal("one/two/threeFour.js");
            const expected = "ThreeFour";
            assert.strictEqual(actual, expected);
        });                       
    });

    describe("camelCase", function(){
        it("first letter does not get capitalized", ()=>{
            const actual = convert.camel("firstSecondThird");
            const expected = "firstSecondThird";
            assert.strictEqual(actual, expected);
        });        
        it("all letters following a dash become uppercase", ()=>{
            const actual = convert.camel("first-second");
            const expected = "firstSecond";
            assert.strictEqual(actual, expected);
        });
        it("leading dashes are removed", ()=>{
            const actual = convert.camel("-FirstSecond");
            const expected = "firstSecond";
            assert.strictEqual(actual, expected);
        });
        it("multiple dashes are removed", ()=>{
            const actual = convert.camel("--First---Second");
            const expected = "firstSecond";
            assert.strictEqual(actual, expected);
        });   
        it("underscores are removed", ()=>{
            const actual = convert.camel("_First_Second");
            const expected = "firstSecond";
            assert.strictEqual(actual, expected);
        });  
        it("multiple underscores are removed", ()=>{
            const actual = convert.camel("First__Second");
            const expected = "firstSecond";
            assert.strictEqual(actual, expected);
        });  
        it("spaces are removed", ()=>{
            const actual = convert.camel(" First  Second ");
            const expected = "firstSecond";
            assert.strictEqual(actual, expected);
        });                 
        it("mixed spaces, underscores, dashes and capilization", ()=>{
            const actual = convert.camel("-First_SecondThird  Fourth");
            const expected = "firstSecondThirdFourth";
            assert.strictEqual(actual, expected);
        });
        it("paths only use the final part", ()=>{
            const actual = convert.camel("one/two/threeFour");
            const expected = "threeFour";
            assert.strictEqual(actual, expected);
        });   
        it("paths remove extensions", ()=>{
            const actual = convert.camel("one/two/threeFour.js");
            const expected = "threeFour";
            assert.strictEqual(actual, expected);
        });                       
    });    
});