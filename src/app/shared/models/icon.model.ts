import { Alias } from "app/shared/models/alias.model";
import { User } from "app/shared/models/user.model";
import { Tag } from "app/shared/models/tag.model";

export class Icon {

  private spaces: string = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
  private pathCommand: RegExp;
  private pathValues: RegExp;

  public id: string = null;
  public name: string = null;
  public data: string = null;
  public user: User = null;
  public aliases: Alias[] = [];
  public tags: Tag[] = [];
  public pointCounttest: number = 0;
  

  constructor(name?: string, data?: string) {

    this.name = name;
    this.data = data;

    this.pathCommand = new RegExp("([a-z])["
      + this.spaces
      + ",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?["
      + this.spaces
      + "]*,?["
      + this.spaces
      + "]*)+)", "ig");
    this.pathValues = new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)["
      + this.spaces + "]*,?["
      + this.spaces + "]*", "ig");

  }

  from(icon: Icon): Icon {
    this.id = icon.id;
    this.name = icon.name;
    this.data = icon.data;
    this.user = new User().from(icon.user);
    this.aliases = icon.aliases.map(a => new Alias().from(a));
    this.tags = icon.tags.map(t => new Tag().from(t));
    return this;
  }

  public fromDto (res: any) {
    this.name = res.name;
    this.data = res.data;
  }

  private r(n: number) {
    return Math.round(n * 100) / 100;
  };

  private parse(path: string) {
    /// <summary>Taken from Snap Library</summary>
    var paramCounts = { a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0 },
      data = [];
    path.replace(this.pathCommand, (a, b, c) => {
      var params = [],
        name = b.toLowerCase();
      c.replace(this.pathValues, function (a, b) {
        b && params.push(+b);
      });
      if (name == "m" && params.length > 2) {
        data.push([b].concat(params.splice(0, 2)));
        name = "l";
        b = b == "m" ? "l" : "L";
      }
      if (name == "o" && params.length == 1) {
        data.push([b, params[0]]);
      }
      if (name == "r") {
        data.push([b].concat(params));
      } else while (params.length >= paramCounts[name]) {
        data.push([b].concat(params.splice(0, paramCounts[name])));
        if (!paramCounts[name]) {
          break;
        }
      }
      return '';
    });
    return data;
  }

  getPointCount() {
    if (this.data != null) {
      return this.parse(this.data).length;
    }
    return 0;
  }

  addAlias(alias: Alias) {
    this.aliases.push(alias);
  }

  addTag(tag: Tag) {
    this.tags.push(tag);
  }

}