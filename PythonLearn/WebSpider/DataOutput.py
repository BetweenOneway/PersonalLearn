# coding:utf-8
import codecs
import traceback

class DataOutput(object):
    def __init__(self):
        self.datas=[]
    def store_data(self,data):
        if data is None:
            return
        self.datas.append(data)

    def output_html(self,fileNameWithPath):
        try:
            fout=codecs.open(fileNameWithPath,'w',encoding='utf-8')
            fout.write("<html>")
            fout.write("<body>")
            fout.write("<table>")
            for data in self.datas:
                fout.write("<html>")
                fout.write("<td>%s</td>"%data['url'])
                fout.write("<td>%s</td>"%data['title'])
                # fout.write("<td>%s</td>"%data['summary'])
                fout.write("</tr>")
                self.datas.remove(data)

            fout.write("</table>")
            fout.write("</body>")
            fout.write("</html>")
            fout.close()
        except Exception as e:
            print("store failed:",e)
            traceback.print_exc()